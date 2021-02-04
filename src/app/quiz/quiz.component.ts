import { Component, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { QuizService } from '../services/quiz.service';
import { Sentence } from '../models/sentence.model';
import swal from 'sweetalert';
import { EventEmitter } from '@angular/core';
import { Scroll } from '../models/scroll.model';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {

  @ViewChild("input") userAnswer;
  @Input() quizType: string;
  @Input() scroll: Scroll;
  @Input() overdueSentences: Sentence[];
  @Output() readyForPromotion: EventEmitter<boolean> = new EventEmitter();

  numberOfSentences: number;
  displayedSentence: string;
  sentence: Sentence;
  sentences: Sentence[];

  practiceSubscription: Subscription = Subscription.EMPTY;
  learningSubscription: Subscription = Subscription.EMPTY;
  quizInProgress: boolean;
  flashCardsInProgress: boolean;

  constructor(private quizService: QuizService) { }

  ngOnInit(): void {
    console.log(this.quizType);
    if (this.overdueSentences)
      this.startQuiz(this.overdueSentences);
    if (this.quizType === 'learn')
      this.subscribeToLearn();
    else if (this.quizType === 'practice')
      this.subscribeToPractice();

  }


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
            .subscribe((sentences: Sentence[]) => {
              if (sentences.length === 0) {
                this.readyForPromotion.emit(true);
              } else {
                this.readyForPromotion.emit(false);
              }
            })
        })
    }
  }
  flipCard(): void {
    if (this.displayedSentence.includes(this.sentence.english[0]))
      this.concatTranslations(this.sentence.translation);
    else
      this.concatTranslations(this.sentence.english);
  }

  previousCard(): void {
    let index = this.sentences.indexOf(this.sentence);
    if (index - 1 < 0)
      this.sentence = this.sentences[this.sentences.length];
    else
      this.sentence = this.sentences[index - 1];

      this.concatTranslations(this.sentence.english);
  }

  nextCard(): void {
    let index = this.sentences.indexOf(this.sentence);
    console.log(this.sentences);
    console.log(this.sentences[1]);
    console.log(index);

    if (index + 1 > this.sentences.length-1)
      this.sentence = this.sentences[0];
    else
      this.sentence = this.sentences[index + 1];

      this.concatTranslations(this.sentence.english);
  }

  stopFlashCards():void{
    this.sentence = null;
    this.flashCardsInProgress=false;
    this.readyForPromotion.emit(false); //to quit from the quiz, didnt make a new emitter for the flashcards
  }

  private displaySentence(sentences: Sentence[]): void {
    this.numberOfSentences = sentences.length;
    this.sentences = sentences;
    this.sentence = sentences[this.numberOfSentences - 1];
    if (this.quizInProgress)
      this.displayedSentence = this.sentence.english[Math.floor(Math.random() * (this.sentence.english.length))];
    if (this.flashCardsInProgress) {
      this.concatTranslations(this.sentence.english);
    }
  }

  private concatTranslations(translations: string[]): void {
    this.displayedSentence = "";
    translations.forEach((translation) => this.displayedSentence += translation + ", ");
    this.displayedSentence = this.displayedSentence.slice(0, -2);

  }

  private startQuiz(sentences: Sentence[]): void {
    this.quizInProgress = true;
    this.displaySentence(sentences);
  }

  private startFlashCards(sentences: Sentence[]): void {
    this.flashCardsInProgress = true;
    this.displaySentence(sentences);
  }


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

  private subscribeToPractice(): void {
    if (this.practiceSubscription) {
      this.practiceSubscription.unsubscribe();
    }
    this.practiceSubscription = this.quizService.getPracticableList()
      .subscribe((sentences: Sentence[]) => {
        if (sentences.length != 0) {
          this.startFlashCards(sentences);
        } else {
          swal("Oops", "You haven't learned anything from this lesson yet.");
        }
      });
    this.quizService.getPracticableSentences(this.scroll._id);
  }
}
