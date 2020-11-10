import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { QuizService } from './quiz.service';
import { Sentence } from './sentence.model';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit, OnDestroy {

  @ViewChild("input") input;
  levelSelected:number;
  sentence:Sentence;
  sentences:Sentence[];
  overduePractice:boolean;
  numberOfSentences:number;
  overdueSubscription:Subscription=Subscription.EMPTY;
  quizSubscription:Subscription=Subscription.EMPTY;
  practiceSubscription:Subscription=Subscription.EMPTY;
  trainingInProgress:boolean;
  practiceClicked:boolean;

  constructor(private quizService:QuizService) {
   }

  ngOnInit(): void {
    this.trainingInProgress=false;
    this.practiceSubscription=this.quizService.getPracticeSentences()
    .subscribe((result)=>{
      if(result){
        this.practiceClicked=false;
        this.displaySentence(result);
      }
    });
    
    this.overdueSubscription=this.quizService.getOverdueSentences()
    .subscribe((sentences:Sentence[])=>{
      this.sentences=sentences;
      this.overduePractice=sentences.length==0? false:true;
    });
  }

  learn():void{
    this.practiceClicked=false;
    this.trainingInProgress=true;
    this.quizSubscription = this.quizService.getLearnableSentences()
    .subscribe((sentences:Sentence[])=>{
      this.displaySentence(sentences)});
  }
 
  practice():void{
    this.practiceClicked=true;
   /* this.trainingInProgress=true;
    this.quizSubscription = this.quizService.getPracticeableSentences(this.levelSelected)
    .subscribe((sentences:Sentence[])=>{
      this.displaySentence(sentences)});*/
  }
  practiceOverdue():void{
    this.trainingInProgress=true;
    this.displaySentence(this.sentences);
  }

  check():void{
    const answer = this.input.nativeElement.value;
    if(this.sentence.translations.find((translation)=> translation===answer)){
      console.log("talált");
      this.quizService.updateSentence(this.sentence._id, 5);
    }else{
      this.quizService.updateSentence(this.sentence._id, 0);
      console.log("elbasztad");
    }
    this.numberOfSentences--;
    if(this.numberOfSentences>0){
      this.sentence=this.sentences[this.numberOfSentences-1];
    }else{
    //  this.quizService.sendUpdatedSentences();
      this.sentence=null;
      this.trainingInProgress=false;
      this.practiceClicked=false;
      if(this.overduePractice) {
        this.overduePractice=false;
      }
    }
  }

  ngOnDestroy():void{
    this.quizSubscription.unsubscribe();
    this.overdueSubscription.unsubscribe();
    this.practiceSubscription.unsubscribe();
  }

  private displaySentence(sentences:Sentence[]):void{
    this.numberOfSentences=sentences.length;
    this.sentence=sentences[this.numberOfSentences-1];
    this.sentences=sentences
  }

}
