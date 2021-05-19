import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PublicationService } from 'src/app/services/publication.service';
import { Question } from 'src/app/models/question.enum';
import { Publication } from 'src/app/models/publication.model';
import { AuthService } from 'src/app/services/auth.service';
import swal from 'sweetalert';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-classroom',
  templateUrl: './classroom.component.html',
  styleUrls: ['./classroom.component.css']
})
export class ClassroomComponent implements OnInit {

  readonly authorMoney:number = 30;
  readonly baseQuestionMoney:number = 1;
  publicationId: string;
  questions: Question[];
  currentQuestion: Question;
  publication: Publication;
  showQuestionTemplate: boolean;
  alreadyVoted:boolean;
  constructor(private router: Router, private pubService: PublicationService, private authService: AuthService) {
    this.publicationId = this.router.getCurrentNavigation().extras.state.id;
  }

  ngOnInit(): void {
    this.init();

    /*  this.questions$ =this.pubService.getQuestions().pipe(map(questions => {
        return questions;
      }));
  
      
     this.pubService.getQuestions().pipe(map(qs =>
        this.questions = qs
      ));*/
    this.pubService.pushQuestions(this.publicationId);
  }

  async init() {
    this.pubService.questions$.pipe(first()).subscribe(response => {
      this.questions = response;
      this.questions.sort((a,b)=>b.popularity-a.popularity);
    });
    this.publication = await this.pubService.getPublicationById(this.publicationId).toPromise();

    // ... and that concludes our analysis of ${this.publication.title} from the great $this.publication.author}
    // any questions?
    //
  }

  onQuestion(): void {
    if (this.questions.length === 0) {
      // Well, no more questions? OK then, thank you for your attention!
      this.onEndLecture();
    } else {
      this.currentQuestion = this.questions[Math.floor(Math.random() * (this.questions.length))];
      this.alreadyVoted = this.currentQuestion.votedBy.includes(localStorage.getItem('userId'));
    }
  }

  
  like(value:number):void{
    console.log(value, typeof value);
    this.pubService.likeQuestion(value,this.currentQuestion._id);
    this.currentQuestion.votedBy.push(localStorage.getItem('userId'));
    this.alreadyVoted = true;
  }


  onAnswer(answer: string): void {
    if (this.currentQuestion.answers.includes(answer)) {
      this.questions.splice(this.questions.indexOf(this.currentQuestion), 1);
      console.log("talált");
      if(this.currentQuestion.userId !== localStorage.getItem('userId')){
        this.authService.giveMoney(this.currentQuestion.userId, this.baseQuestionMoney * answer.length).toPromise();
        this.authService.updateMoney(this.baseQuestionMoney * answer.length).toPromise();
      }
    } else {
      console.log("elbasztad");
    }
    this.currentQuestion = null;
  }

  onEndLecture(): void {
    swal("would you like to add one question?", {
      buttons: {
        yes: {
          text: "Yes",
          value: "yes"
        },
        no: {
          text: "No",
          value: "no",
        },
      },
    }).then((answer) => {
      if (answer === "yes") {
        this.showQuestionTemplate = true;
      } else {
        this.quit(true);
      }
    })
  }

  quit(event: boolean): void {
    if (event) {
      this.authService.giveMoney(this.publication.userId,this.authorMoney).toPromise();
      this.authService.gaveLecture().toPromise();
      this.pubService.hasBeenTaught(this.publication);
      this.pubService.deleteUnpopularQs(this.publication);
      this.router.navigate(['/guild']);
    }
  }
}
