import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PublicationService } from 'src/app/services/publication.service';
import { map, switchMap } from 'rxjs/operators';
import { Question } from 'src/app/models/question.enum';
import { Observable } from 'rxjs';
import { Publication } from 'src/app/models/publication.model';

@Component({
  selector: 'app-classroom',
  templateUrl: './classroom.component.html',
  styleUrls: ['./classroom.component.css']
})
export class ClassroomComponent implements OnInit {
  publicationId: string;
  questions:Question[];
  currentQuestion:Question;
  publication:Publication;

  constructor(private router: Router, private pubService: PublicationService) {
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

  async init(){
    this.pubService.getQuestions().subscribe(response => {
      this.questions = response;
    });
    this.publication = await this.pubService.getPublicationById(this.publicationId).toPromise();

    // ... and that concludes our analysis of ${this.publication.title} from the great $this.publication.author}
    // any questions?
    //
  }

  onQuestion():void{
   this.currentQuestion =  this.questions[Math.floor(Math.random() * (this.questions.length))];
   const index = this.questions.indexOf(this.currentQuestion );
   this.questions.splice(index,1);
  }

  onAnswer(answer:string):void{
    console.log(this.currentQuestion.answers);
    console.log(answer);
    if(this.currentQuestion.answers.includes(answer))
      console.log("talált");
      else
      console.log("elbasztad");

      this.currentQuestion=null;
  }

}
