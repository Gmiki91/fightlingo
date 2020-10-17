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
  levelChangeSubscription:Subscription=Subscription.EMPTY;
  
  constructor(private quizService:QuizService) { }

  ngOnInit(): void {
    this.levelChangeSubscription=this.quizService.getLevelChanged()
    .subscribe((number)=>{
      if(number){
        this.levelSelected=number;
      }
    });
    
    this.overdueSubscription=this.quizService.getOverdueSentences()
    .subscribe((sentences:Sentence[])=>{
      this.sentences=sentences;
      this.overduePractice=sentences.length==0? false:true;
    });
  }

  learn():void{
    this.quizSubscription = this.quizService.getLearnableSentences(this.levelSelected)
    .subscribe((sentences:Sentence[])=>{
      this.displaySentence(sentences)});
  }
  practice():void{
    
    this.quizSubscription = this.quizService.getPracticeableSentences(this.levelSelected)
    .subscribe((sentences:Sentence[])=>{
      this.displaySentence(sentences)});
  }
  practiceOverdue():void{
      this.displaySentence(this.sentences);
  }

  check():void{
    const answer = this.input.nativeElement.value;
    if(this.sentence.translations.find((translation)=> translation===answer)){
      console.log("talált");
      this.quizService.updateSentence(this.sentence, 5);
      this.numberOfSentences--;
    }else{
      this.quizService.updateSentence(this.sentence, 0);
      console.log("elbasztad");
    }
    if(this.numberOfSentences>0){
      this.sentence=this.sentences[this.numberOfSentences-1];
    }else{
    //  this.quizService.sendUpdatedSentences();
      this.sentence=null;
      if(this.overduePractice) this.overduePractice=false;
    }
  }

  ngOnDestroy():void{
    this.quizSubscription.unsubscribe();
    this.overdueSubscription.unsubscribe();
    this.levelChangeSubscription.unsubscribe();
  }

  private displaySentence(sentences:Sentence[]):void{
    this.numberOfSentences=sentences.length;
    this.sentence=sentences[this.numberOfSentences-1];
    this.sentences=sentences
  }

}
