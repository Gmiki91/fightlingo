import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PublicationService } from 'src/app/shared/services/publication.service';
import { Question } from 'src/app/shared/models/question.model';
import { Publication } from 'src/app/shared/models/publication.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import swal from 'sweetalert';
import { take } from 'rxjs/operators';
import { CharacterService } from 'src/app/shared/services/character.service';
import { Character } from 'src/app/shared/models/character.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-classroom',
  templateUrl: './classroom.component.html',
  styleUrls: ['./classroom.component.css']
})
export class ClassroomComponent implements OnInit, OnDestroy {

  readonly authorMoney: number = 30;
  readonly baseQuestionMoney: number = 1;
  publicationId: string;
  questions: Question[];
  currentQuestion: Question;
  publication: Publication;
  char:Character;
  sub:Subscription = Subscription.EMPTY;
  showQuestionTemplate: boolean;
  alreadyVoted: boolean;
  constructor(private router: Router, private pubService: PublicationService, private authService: AuthService, private characterService:CharacterService) {
    this.publicationId = this.router.getCurrentNavigation().extras.state.id;
  }

  ngOnInit(): void {
    this.init();

    this.sub = this.characterService.character$.subscribe(char=>{
      this.char=char;
    })
    /*  this.questions$ =this.pubService.getQuestions().pipe(map(questions => {
        return questions;
      }));
  
      
     this.pubService.getQuestions().pipe(map(qs =>
        this.questions = qs
      ));*/
    this.pubService.pushQuestions(this.publicationId);
  }

  ngOnDestroy():void{
    this.sub?.unsubscribe();
  }

  init() {
    this.pubService.questions$.pipe(take(1)).subscribe(response => {
      this.questions = response;
      this.questions.sort((a, b) => b.popularity - a.popularity);
    });
    this.pubService.getPublicationById(this.publicationId).toPromise().then((publication)=>{this.publication=publication});

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
      this.alreadyVoted = this.currentQuestion.votedBy.includes(this.char._id);
    }
  }


  like(value: number): void {
    this.pubService.likeQuestion(value, this.currentQuestion._id);
    this.currentQuestion.votedBy.push(this.char._id);
    this.alreadyVoted = true;
  }


  onAnswer(answer: string): void {
    if (this.currentQuestion.answers.includes(answer)) {
      this.questions.splice(this.questions.indexOf(this.currentQuestion), 1);
      console.log("talált");
      if (this.currentQuestion.userId !== this.char._id) {
        this.characterService.giveMoney(this.currentQuestion.userId, this.baseQuestionMoney * answer.length).toPromise();
        this.characterService.updateMoney(this.baseQuestionMoney * answer.length).toPromise();
      }
    } else {
      console.log("elbasztad");
    }
    this.currentQuestion = null;
  }

  onEndLecture(): void {
    if(this.publication.characterId != this.char._id){
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
  }else{
    this.quit(true);
  }
  }

  quit(event: boolean): void {
    if (event) {
      if (this.publication.characterId != this.char._id) {
        this.characterService.giveMoney(this.publication.characterId, this.authorMoney).toPromise();
      }
      this.characterService.gaveLecture().toPromise();
      this.pubService.hasBeenTaught(this.publication);
      this.pubService.deleteUnpopularQs(this.publication);
      this.router.navigate(['/guild']);
    }
  }
}
