import { Component, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { QuizService } from '../services/quiz.service';
import { Sentence } from '../models/sentence.model';
import swal from 'sweetalert';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {

  @ViewChild("input") userAnswer;
  @Input() quizType: string;
  @Output() readyForPromotion: EventEmitter<boolean> = new EventEmitter();

  levelSelected: number;
  numberOfSentences: number;
  displayedSentence: string;
  sentence: Sentence;
  sentences: Sentence[];
  overdueSubscription: Subscription = Subscription.EMPTY;
  practiceSubscription: Subscription = Subscription.EMPTY;
  learningSubscription: Subscription = Subscription.EMPTY;
  quizInProgress: boolean;
  overduePractice: boolean;

  constructor(private quizService: QuizService) { }
  /*
    ngOnChanges(changes: SimpleChanges) {
      console.log(changes["clickedButton"]["currentValue"]);
      if (changes["clickedButton"]["currentValue"]=="translate"){
        this.quizService.getLearnableSentences();
      }
    }
  */
  ngOnInit(): void {
    console.log(this.quizType);
    if (this.quizType === 'learn')
      this.subscribeToLearn();
    if (this.quizType === 'overdue')
      this.subscribeToOverdue();

  }

  /*getOverdues(): void {
    this.quizService.getOverdueSentences();
  }*/

 /* practiceOverdue(): void {
    this.quizInProgress = true;
    this.displaySentence(this.sentences);
  }
*/
  check(): void {
    const answer = this.userAnswer.nativeElement.value;
    if (this.sentence.translation.find((translation) => translation === answer)) {
      console.log("talált");
      this.quizService.updateSentence(this.sentence._id, 5);
    } else {
      console.log("elbasztad");
      this.quizService.updateSentence(this.sentence._id, 0);
    }

    this.numberOfSentences--;
    if (this.numberOfSentences > 0) {
      this.sentence = this.sentences[this.numberOfSentences - 1];
      this.displayedSentence = this.sentence.english[Math.floor(Math.random() * (this.sentence.english.length))]
    } else {
      ;
      swal("Well done!", "...You finished the quiz!")
        .then(() => {
          this.sentence = null;
          this.quizInProgress = false;
          this.quizService.checkIfLessonLearned()
          .subscribe((sentences:Sentence[])=>{
            if(sentences.length === 0){
              this.readyForPromotion.emit(true);
            }else{
              this.readyForPromotion.emit(false);
            }
        })
          
         /* if (this.learning) {
            this.checkAvailablePromotion();
            this.learning = false;
          } else if (this.overduePractice) {
            this.getOverdues();
          }*/
        })
    }
  }


  private displaySentence(sentences: Sentence[]): void {
    this.numberOfSentences = sentences.length;
    this.sentences = sentences;
    this.sentence = sentences[this.numberOfSentences - 1];
    this.displayedSentence = this.sentence.english[Math.floor(Math.random() * (this.sentence.english.length))]
  }

  private startQuiz(sentences: Sentence[]): void {
    this.quizInProgress = true;
    this.displaySentence(sentences);
  }

/*  private async checkAvailablePromotion() {
    if (this.quizService.isCurrentLessonLearned()) {
      this.authService.currentLessonFinished();
      let lessonName = await this.quizService.getLessonByPlayerRank().pipe(first()).toPromise();
      swal(`You've mastered the ways of the ${lessonName}, well done!`);
    }
  }
*/
  private subscribeToLearn() {
    if (this.learningSubscription) {
      this.learningSubscription.unsubscribe();
    }
    this.learningSubscription = this.quizService.getLearnableList()
      .subscribe((sentences: Sentence[]) => {
        if (sentences.length != 0) {
          this.startQuiz(sentences);
        } else {
          swal("Hold your horses!", "There is nothing to learn :(");
        }
      });
      this.quizService.getLearnableSentences();
  }

  /* private subscribeToPractice(): void {
     if (this.practiceSubscription) {
       this.practiceSubscription.unsubscribe();
     }
     this.practiceSubscription = this.quizService.getPracticeSentences()
       .subscribe((sentences: Sentence[]) => {
         if (sentences.length != 0) {
           this.startQuiz(sentences);
         } else {
           swal("Oops", "You haven't learned anything from this lesson yet.");
         }
       });
   }*/

  private subscribeToOverdue(): void {
    if (this.overdueSubscription) {
      this.overdueSubscription.unsubscribe();
    }
    this.overdueSubscription = this.quizService.getOverdueList()
      .subscribe((sentences: Sentence[]) => {
        this.sentences = sentences;
        this.overduePractice = sentences.length == 0 ? false : true;
      });
  }

}
