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
  sentence:Sentence;
  sentenceSubscription:Subscription;

  constructor(private quizService:QuizService) { }

  ngOnInit(): void {
    this.quizService.getSentence();
    this.sentenceSubscription = this.quizService.getSentenceUpdateListener()
    .subscribe((sentence:Sentence)=>this.sentence=sentence);
  }
  learn():void{

  }
  practice():void{
    
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
  }
  ngOnDestroy():void{
    this.sentenceSubscription.unsubscribe();
  }

}
