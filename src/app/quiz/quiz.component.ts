import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { QuizService } from '../services/quiz.service';
import { Sentence } from '../models/sentence.model';
import swal from 'sweetalert';
import { first } from 'rxjs/operators'
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit, OnChanges {

  @ViewChild("input") userAnswer;
  @Input() clickedButton: string;
  levelSelected: number;
  numberOfSentences: number;
  sentence: Sentence;
  sentences: Sentence[];
  overdueSubscription: Subscription = Subscription.EMPTY;
  practiceSubscription: Subscription = Subscription.EMPTY;
  learningSubscription: Subscription = Subscription.EMPTY;
  quizInProgress: boolean;
  overduePractice: boolean;
  showLevelTree: boolean;
  learning: boolean;

  constructor(private quizService: QuizService, private router: Router, private authService: AuthService) {}

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes["clickedButton"]["currentValue"]);
    if (changes["clickedButton"]["currentValue"]=="translate"){
      this.quizService.getLearnableSentences();
    }
    if (changes["clickedButton"]["currentValue"]=="study")
      this.showLevelTree = true;
  }

  ngOnInit(): void {
    this.quizInProgress = false;
    this.subscribeToLearn();
    //this.subscribeToPractice();
    this.subscribeToOverdue();
    this.getOverdues();
  }

  getOverdues(): void {
    this.quizService.getOverdueSentences();
  }

  practiceOverdue(): void {
    this.quizInProgress = true;
    this.displaySentence(this.sentences);
  }

  check(): void {
    const answer = this.userAnswer.nativeElement.value;
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
      this.quizService.checkIfLessonLearned();
      swal("Well done!", "...You finished the quiz!")
        .then(() => {
          this.sentence = null;
          this.quizInProgress = false;
          this.showLevelTree = false;
          if (this.learning) {
            this.checkAvailablePromotion();
            this.learning = false;
          } else if (this.overduePractice) {
            this.getOverdues();
          }
        })
    }
  }


  private displaySentence(sentences: Sentence[]): void {
    this.numberOfSentences = sentences.length;
    this.sentences = sentences;
    this.sentence = sentences[this.numberOfSentences - 1];
  }

  private startQuiz(sentences: Sentence[]): void {
    this.showLevelTree = false;
    this.quizInProgress = true;
    this.displaySentence(sentences);
  }

  private async checkAvailablePromotion() {
    if (this.quizService.isCurrentLessonLearned()) {
      this.authService.currentLessonFinished();
      let lessonName = await this.quizService.getLessonByPlayerRank().pipe(first()).toPromise();
      swal(`You've mastered the ways of the ${lessonName}, well done!`);
    }
  }

  private subscribeToLearn() {
    if (this.learningSubscription) {
      this.learningSubscription.unsubscribe();
    }
    this.learningSubscription = this.quizService.getLearnableList()
      .subscribe((sentences: Sentence[]) => {
        if (sentences.length != 0) {
          this.learning = true;
          this.startQuiz(sentences);
        } else {
          swal("Hold your horses!", "Your latest translation is under approval. Wait until tomorrow.");
        }
      })
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
