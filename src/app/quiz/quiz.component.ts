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
  overdueSentences:Sentence[];
  numberOfSentences:number;
  overdueSubscription:Subscription;
  learnableSubscription:Subscription;
  levelChangeSubscription:Subscription;
  practiceableSubscription:Subscription;
  
  constructor(private quizService:QuizService) { }

  ngOnInit(): void {
    this.levelChangeSubscription=this.quizService.getLevelChanged()
    .subscribe((number)=>{
      if(number){
        console.log(number);
        this.levelSelected=number;
      }
    });
    this.quizService.getOverdueSentences();
    this.overdueSubscription=this.quizService.getOverdueListUpdateListener()
    .subscribe((sentences:Sentence[])=>{
      this.overdueSentences=sentences;
    })
  }

  learn():void{
    this.quizService.getLearnableSentences(this.levelSelected);
    this.learnableSubscription = this.quizService.getSentenceListUpdateListener()
    .subscribe((sentences:Sentence[])=>{
      this.displaySentence(sentences)});
  }
  practice():void{
    this.quizService.getPracticeableSentences(this.levelSelected);
    this.learnableSubscription = this.quizService.getSentenceListUpdateListener()
    .subscribe((sentences:Sentence[])=>{
      this.displaySentence(sentences)});
  }
  practiceOverdue():void{
    this.displaySentence(this.overdueSentences);
  }
  theory():void{
    
  }

  

  check():void{
    const answer = this.input.nativeElement.value;
    if(this.sentence.translations.find((translation)=> translation===answer)){
      console.log("talált");
      this.quizService.updateSentence(this.sentence, 5);
    }else{
      this.quizService.updateSentence(this.sentence, 0);
      console.log("elbasztad");
    }
    this.numberOfSentences--;
    if(this.numberOfSentences>0){
      this.sentence=this.sentences[this.numberOfSentences-1];
    }else{
    //  this.quizService.sendUpdatedSentences();
      this.sentence=null;
    }
  }

  ngOnDestroy():void{
    this.learnableSubscription.unsubscribe();
    this.practiceableSubscription.unsubscribe();
    this.overdueSubscription.unsubscribe();
  }

  private displaySentence(sentences:Sentence[]):void{
    this.numberOfSentences=sentences.length;
    this.sentence=sentences[this.numberOfSentences-1];
    this.sentences=sentences
  }

}
