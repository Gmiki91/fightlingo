import { Component, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { CharacterService } from '../services/character.service';
import { QuizService } from '../services/quiz.service';
import { Sentence } from '../models/sentence.model';
import { Scroll } from '../models/scroll.model';
import swal from 'sweetalert';
import { Script } from '../models/script.model';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit, OnChanges {

  @ViewChild("input") userAnswer;
  @Input() isExam: boolean;
  @Input() quizType: string;
  @Input() script: Script;
  @Input() scroll: Scroll;
  @Input() overdueSentences: Sentence[];
  @Output() exitQuizEmitter: EventEmitter<boolean> = new EventEmitter();
  @Output() fightQuizResult: EventEmitter<boolean> = new EventEmitter();
  numberOfSentences: number;
  displayedSentence: string;
  translation: string;
  sentence: Sentence;
  sentences: Sentence[];
  quizInProgress: boolean;
  fightInProgress: boolean;
  flashCardsInProgress: boolean;
  sentenceIndex = 0;

  constructor(private quizService: QuizService, private charService: CharacterService) { }

  ngOnInit(): void {
    if (this.overdueSentences){
      console.log(this.script.startText);
      this.startQuiz(this.overdueSentences);
    }
    if (this.quizType === 'learn')
      this.subscribeToLearn();
    else if (this.quizType === 'practice')
      this.subscribeToPractice();
  }

  ngOnChanges() {
    if (this.quizType === 'fight' || this.quizType === 'test') {
      this.fight();
    }
  }

  checkFight(): void {
    const answer = this.userAnswer.nativeElement.value;

    if (this.sentence.translation.find((translation) => translation === answer)) {
      console.log("talált");
      this.fightQuizResult.emit(true);

    } else {
      console.log("elbasztad");
      this.fightQuizResult.emit(false);
    }
    this.sentenceIndex++;
    if (this.isExam && this.sentences.length === this.sentenceIndex) {
      this.exitQuizEmitter.emit(true);
    }
    if (this.quizService.testSentence ==null || this.quizService.testSentence?.level < this.sentence.level) { 
      this.quizService.testSentence = this.sentence;
    }
    this.fightInProgress = false;
    this.sentence = null;
  }

  checkQuiz(): void {
    this.translation = null;
    const answer = this.userAnswer.nativeElement.value;
    if (this.sentence.translation.find((translation) => translation === answer)) {
      console.log("talált");
      this.quizService.updateSentence(this.sentence._id, 5);
      if (this.overdueSentences){
        this.charService.updateMoney(1);
        console.log(this.script.positive[Math.floor(Math.random() * (this.script.positive.length))]);
      }
    } else {
      console.log("elbasztad");
      this.quizService.updateSentence(this.sentence._id, 0);
      if (this.overdueSentences){
        console.log(this.script.negative[Math.floor(Math.random() * (this.script.negative.length))])
      }
    }

    this.numberOfSentences--;
    if (this.numberOfSentences > 0) {
      this.sentence = this.sentences[this.numberOfSentences - 1];
      this.displayedSentence = this.sentence.english[Math.floor(Math.random() * (this.sentence.english.length))]
    } else {
      swal("Well done!", "...You finished the quiz!")
        .then(() => {
          this.sentence = null;
          this.quizInProgress = false;
          if (this.quizType === 'learn') {
            this.quizService.getLearnableSentences().toPromise().then((result) => {
              const sentencesLeft = result;
              if (sentencesLeft.length === 0) {
                this.exitQuizEmitter.emit(true);
              } else {
                this.exitQuizEmitter.emit(false);
              }
            });

          } else { //overdue
            console.log(this.script.ending[Math.floor(Math.random() * (this.script.ending.length))]);
            this.quizService.getOverdueSentences().toPromise();
            this.exitQuizEmitter.emit(false);
          }
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

    if (index + 1 > this.sentences.length - 1)
      this.sentence = this.sentences[0];
    else
      this.sentence = this.sentences[index + 1];

    this.concatTranslations(this.sentence.english);
  }

  stopFlashCards(): void {
    this.sentence = null;
    this.flashCardsInProgress = false;
    this.exitQuizEmitter.emit(false); //to quit from the quiz, didnt make a new emitter for the flashcards
  }

  showTranslation(): void {
    this.translation = this.sentence.english[0];
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

  private fight() {
    this.fightInProgress = true;
    if (typeof this.sentences === 'undefined') {
      if (this.quizType === 'fight') {
        this.quizService.getFightSentences().toPromise()
          .then((result) => {
            this.sentences = result;
            this.displayFightSentence();
          });
      } else if (this.quizType === 'test') {
        this.quizService.getTestSentences().toPromise()
          .then((result) => {
            this.sentences = result;
            this.displayExamSentence();
          });
      }
    } else {
      if (this.quizType === 'fight')
        this.displayFightSentence();
      if (this.quizType === 'test')
        this.displayExamSentence();
    }
  }

  private displayExamSentence() {
    this.sentence = this.sentences[this.sentenceIndex];
    this.displayedSentence = this.sentence.english[Math.floor(Math.random() * (this.sentence.english.length))];
  }

  private displayFightSentence() {
    this.sentence = this.sentences[Math.floor(Math.random() * this.sentences.length)];
    this.displayedSentence = this.sentence.english[Math.floor(Math.random() * (this.sentence.english.length))];
  }

  private subscribeToLearn() {
    this.quizService.getLearnableSentences().toPromise().then((result) => {
      const sentences = result;
      if (sentences.length != 0) {
        this.startQuiz(sentences);
      } else {
        swal("Hold your horses!", "There is nothing to learn :(");
      }
    })
  }

  private subscribeToPractice() {
    this.quizService.getPracticableSentences(this.scroll._id).toPromise().then((result) => {
      const sentences = result;
      if (sentences.length != 0) {
        this.startFlashCards(sentences);
      } else {
        swal("Oops", "You haven't learned anything from this lesson yet.");
      }
    })
  }
}
