import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PublicationService } from 'src/app/services/publication.service';
import { map, switchMap } from 'rxjs/operators';
import { Question } from 'src/app/models/question.enum';
import { Observable, Subscription } from 'rxjs';
import { Publication } from 'src/app/models/publication.model';
import { AuthService } from 'src/app/services/auth.service';

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
  subscription:Subscription;
  constructor(private router: Router, private pubService: PublicationService, private authService:AuthService) {
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
    this.subscription= this.pubService.getQuestions().subscribe(response => {
      this.questions = response;
    });
    this.publication = await this.pubService.getPublicationById(this.publicationId).toPromise();

    // ... and that concludes our analysis of ${this.publication.title} from the great $this.publication.author}
    // any questions?
    //
  }

  onQuestion():void{
    if(this.questions.length===0){
      
      // Well, no more questions? OK then, thank you for your attention!
      this.onEndLecture();
    }else{
      this.currentQuestion =  this.questions[Math.floor(Math.random() * (this.questions.length))];
    }
  }

  onAnswer(answer:string):void{
    if(this.currentQuestion.answers.includes(answer)){
      this.questions.splice(this.questions.indexOf(this.currentQuestion ),1);
      console.log("talált");
    }else{
      console.log("elbasztad");
    }
      this.currentQuestion=null;
  }

  onEndLecture():void{
    this.authService.gaveLecture().toPromise();
      this.pubService.hasBeenTaught(this.publication);
    this.subscription?.unsubscribe();
    this.router.navigate(['/guild']);
  }

}
