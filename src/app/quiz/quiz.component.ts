import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { QuizService } from './quiz.service';
import { Sentence } from './sentence.model';
import swal from 'sweetalert';
import { first } from 'rxjs/operators'
import { Router } from '@angular/router';
import { Lesson } from './level-tree/lesson.model';
import { ArenaService } from '../dojo/arena/arena.service';
import { AuthService } from '../auth/auth.service';

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
  learningSubscription: Subscription = Subscription.EMPTY;
  trainingInProgress: boolean;
  overduePractice: boolean;
  practiceClicked: boolean;
  learning: boolean;

  constructor(private quizService: QuizService, private arenaService: ArenaService, private router: Router, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.trainingInProgress = false;

    this.subscribeToLearn();
    this.subscribeToPractice();
    this.subscribeToOverdue();

    this.getOverdues();
  }

  getOverdues(): void {
    this.quizService.getOverdueSentences();
  }

  learn(): void {
    this.quizService.getLearnableSentences();
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
      this.quizService.getPromotionRequest();
      swal("Well done!", "...You finished the quiz!")
      .then(() => {
        this.sentence = null;
        this.trainingInProgress = false;
        this.practiceClicked = false;
        if (this.learning) {
          this.checkAvailablePromotion();
          this.learning = false;
        } else if (this.overduePractice) {
          this.getOverdues();
        }
      })
    }
  }

  onLeave() {
    swal("Do you want to finish your training for now?", {
      buttons: {
        yes: {
          text: "Yes!",
          value: "yes"
        },
        no: {
          text: "Actually, no...",
          value: "no",
        },
      },
    }).then((answer) => {
      if (answer == "yes") {
        this.router.navigate(['/dojo']);
      }
    })
  }

  private displaySentence(sentences: Sentence[]): void {
    this.numberOfSentences = sentences.length;
    this.sentences = sentences;
    this.sentence = sentences[this.numberOfSentences - 1];
  }

  private startQuiz(sentences: Sentence[]): void {
    this.practiceClicked = false;
    this.trainingInProgress = true;
    this.displaySentence(sentences)
  }

  private async checkAvailablePromotion() {
    if (this.quizService.isPromotionDue()) {
      let lessonName = await this.quizService.getLessonByPlayerRank().pipe(first()).toPromise();
      let master = await this.arenaService.getMasterByRank().pipe(first()).toPromise();
      swal(`You've mastered the ways of the ${lessonName}, well done!`)
      .then(() => {
        swal(`Master ${master.name} has been impressed with your progress and challenges you to a match in the arena.`);
      });
      this.authService.updateRank()
    }
  }

  private subscribeToLearn(){
    if (this.learningSubscription) {
      this.learningSubscription.unsubscribe();
    }
    this.learningSubscription = this.quizService.getLearnableList()
    .subscribe((sentences: Sentence[]) => {
      if (sentences.length != 0) {
        this.learning = true;
        this.startQuiz(sentences);
      } else {
        swal("Oops", "There is nothing new to learn. Prove yourself in the arena to unlock new techniques.");
      }
    })
  }

  private subscribeToPractice():void{
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
  }

  private subscribeToOverdue():void{
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
