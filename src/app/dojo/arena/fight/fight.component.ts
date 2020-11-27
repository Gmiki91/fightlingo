import { ViewChild } from '@angular/core';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { Sentence } from 'src/app/quiz/sentence.model';
import swal from 'sweetalert';
import { QuizService } from '../../../quiz/quiz.service';
import { Master } from '../../master.model';
import { ArenaService } from '../arena.service';

@Component({
  selector: 'app-fight',
  templateUrl: './fight.component.html',
  styleUrls: ['./fight.component.css']
})
export class FightComponent implements OnInit {

  @Input() master: Master;
  @ViewChild("input") input;
  @Output() onTank = new EventEmitter<number>();
  sentences: Sentence[];
  sentence: Sentence;
  count: number = 0;

  constructor(private quizService: QuizService, private authService: AuthService, private arenaService: ArenaService, private router: Router) { }

  ngOnInit(): void {
    console.log(this.master);
    this.start();
  }

  start(): void {
    if (this.master.gm) {
      console.log(this.master.gm);
      this.quizService.getSentencesByLevel(this.master.level).subscribe(sentences => {

        this.sentences = sentences;
        this.displaySentence();
      })
    } else {
      this.arenaService.getSentencesOfMastersLesson(this.master.rank).subscribe(sentences => {
        this.sentences = sentences;
        this.displaySentence();
      })
    }
  }

  displaySentence(): void {
    this.sentence = this.sentences[Math.floor(Math.random() * this.sentences.length - 1) + 1];
  }

  check(): void {
    const answer = this.input.nativeElement.value;
    if (this.sentence.translations.find((translation) => translation === answer)) {
      this.count += 0.25;
      this.onTank.emit(this.count);
      this.quizService.updateSentence(this.sentence._id, 5);
    } else {
      this.quizService.updateSentence(this.sentence._id, 0);
    }
    if (this.count == 1) {
      this.sentence = null;
    } else {
      this.displaySentence();
    }
  }

  attack(): void {
    let rnd = Math.random();
    console.log("rnd", rnd);
    if (rnd > this.count) {
      console.log("miss");
    } else {
      this.master.health -= 2;
      if (this.master.health < 1)
      this.youwon();
    }
      this.onTank.emit(0);
      this.count = 0;
      this.displaySentence();
  }

  youwon(): void {
    let currentRank = this.authService.user.rank;
    swal(`You beat ${this.master.name}!`).then(async () => {
      if (currentRank == this.master.rank) {
        if (this.master.gm) {
          this.authService.levelUp();
          swal(`You beat level ${currentRank}! Well done!`)
            .then(() => swal(`Grandmaster ${this.master.name} has invited you to teach in his prestigious dojo. Head to the city to check it out!`));
        } else {
          this.authService.updateRank();

          let nextMaster = await this.arenaService.getMasterByRank(this.authService.user.rank + 1).pipe(first()).toPromise();
          if (nextMaster) { //current rank is an even number, +1 makes it odd, only gm-s have odd ranks
            swal(`You are now ready to face ${nextMaster.name}`);
          } else {
            swal(`A new lesson has opened up.`);
          }
        }
      }
      this.router.navigate(['/dojo']);
    })
  }
}
