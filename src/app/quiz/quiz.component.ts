import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { QuizService } from './quiz.service';
import { Sentence } from './sentence.model';
import swal from 'sweetalert';
import {first} from 'rxjs/operators'
import { Router } from '@angular/router';
import { Lesson } from './level-tree/lesson.model';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {

  @ViewChild("input") input;
  levelSelected: number;
  numberOfSentences: number;
  sentence: Sentence;
  sentences: Sentence[];
  overdueSubscription: Subscription = Subscription.EMPTY;
  practiceSubscription: Subscription = Subscription.EMPTY;
  trainingInProgress: boolean;
  overduePractice: boolean;
  practiceClicked: boolean;
  learning:boolean;

  constructor(private quizService: QuizService, private router: Router) {
  }

  ngOnInit(): void {
    this.trainingInProgress = false;
    if (this.practiceSubscription) {
      this.practiceSubscription.unsubscribe();
    }
    this.practiceSubscription = this.quizService.getPracticeSentences()
      .subscribe((sentences: Sentence[]) => {
        if (sentences.length!=0) {
          this.startQuiz(sentences);
        }else{
          swal("Oops", "You haven't learned anything from this lesson yet.");
        }
      });
    this.checkOverdues();
  }

  learn(): void {
    this.quizService.getLearnableSentences().pipe(first())
    .subscribe((sentences: Sentence[]) => {
        if(sentences.length!=0){
          this.learning=true;
          this.startQuiz(sentences);
        }else{
          swal("Oops", "There is nothing new to learn");
        }
      });
  }

  practice(): void {
    this.practiceClicked = true;
  }

  practiceOverdue(): void {
    this.trainingInProgress = true;
    this.displaySentence(this.sentences);
  }

  check(): void {
    const answer = this.input.nativeElement.value;
    if (this.sentence.translations.find((translation) => translation === answer)) {
      console.log("talált");
      this.quizService.updateSentence(this.sentence._id, 5);
    } else {
      console.log("elbasztad");
      this.quizService.updateSentence(this.sentence._id, 0);
    }

    this.numberOfSentences--;
    if (this.numberOfSentences > 0) {
      this.sentence = this.sentences[this.numberOfSentences - 1];
    } else {
      swal("Well done!", "...You finished the quiz!");
      setTimeout(() => {
        this.sentence = null;
        this.trainingInProgress = false;
        this.practiceClicked = false;
        if(this.learning){
          this.checkAvailablePromotion();
        }else if (this.overduePractice) {
          this.checkOverdues();
        }
      },250)
    }
  }
 
  onLeave(){
    swal("Do you want to finish your training for now?", {
      buttons: {
        yes:{
          text: "Yes!",
          value:"yes"
        }, 
        no: {
          text: "Actually, no...",
          value: "no",
        },
      },
    }).then((answer) => {
      if (answer=="yes") {
        this.router.navigate(['/dojo']);
      }
    })
  }


  private checkOverdues(): void {
    if (this.overdueSubscription) {
      this.overdueSubscription.unsubscribe();
    }
    this.overdueSubscription = this.quizService.getOverdueSentences()
      .subscribe((sentences: Sentence[]) => {
        this.sentences = sentences;
        this.overduePractice = sentences.length == 0 ? false : true;
      });
  }

  private displaySentence(sentences: Sentence[]): void {
    this.numberOfSentences = sentences.length;
    this.sentences = sentences;
    this.sentence = sentences[this.numberOfSentences - 1];
  }

  private startQuiz(sentences:Sentence[]):void{
    this.practiceClicked = false;
    this.trainingInProgress = true;
    this.displaySentence(sentences)
  }

  private checkAvailablePromotion():void{
    this.quizService.getLearnableSentences()
    .subscribe(async (sentences: Sentence[]) => {
        if(sentences.length===0){
          let lessonName = await this.quizService.getLessonByPlayerRank().pipe(first()).toPromise();
          let masterName = "béla"
          console.log(`You've mastered the ways of the  ${lessonName}, ${masterName} would like to see it in practice`);
         /* this.quizService.getLessonByPlayerRank().pipe(first())
          .subscribe((lessonName:string)=>{
            console.log("You've mastered the ways of the " + lessonName)
          });*/
        }
      })
      this.learning = false;
  }
}
