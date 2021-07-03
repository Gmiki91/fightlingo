import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Language } from 'src/app/language.enum';
import { Character } from 'src/app/models/character.model';
import { Scroll } from 'src/app/models/scroll.model';
import { CharacterService } from 'src/app/services/character.service';
import { QuizService } from 'src/app/services/quiz.service';
import { ScrollService } from 'src/app/services/scroll.service';
import swal from 'sweetalert';
import Typewriter from 't-writer.js'

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.css']
})
export class IntroComponent implements OnInit, OnDestroy {

  scroll$: Observable<Scroll>;
  isBeginner: boolean;
  notesChecked: boolean;
  showGym: boolean;
  char: Character;
  private sub: Subscription;
  constructor(
    private characterService: CharacterService,
    private scrollService: ScrollService,
    private quizService: QuizService,
    private router: Router,
  ) { }


  ngOnInit(): void {
    this.sub = this.characterService.character$.subscribe((char: Character) => {
      this.char = char;
      this.checkProficiency(char.language);
    });
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  private checkProficiency(language: Language) {
    swal(`Are you a beginner at ${language}?`, {
      buttons: {
        yes: {
          text: "Yes",
          value: true
        },
        no: {
          text: "No",
          value: false
        },
      },
    }).then(answer => this.startIntro(answer))
  }

  private startIntro(beginner: boolean) {
    this.isBeginner = beginner;
    const text = beginner ? "You are a beginner! Check your notes!" : "So you think you know shit? Lets do the exam then!";
    const target = document.querySelector('.tw')
    const writer = new Typewriter(target, {
      loop: false,
      typeColor: 'blue'
    })
    writer
      .type(text)
      .rest(250)
      .start();
  }

  onNotes(): void {
    this.scroll$ = this.scrollService.getOneScroll(1);
    this.notesChecked = true;
  }

  onTakeExam() {
    this.showGym = true;
  }

  fightFinished(event: boolean) {

    this.sub.unsubscribe();
    this.showGym = false;
    if (event && this.isBeginner) {
      swal("congrats");
      this.characterService.levelUp().toPromise().then(() => {
        this.router.navigate(['/']);
      });
    } else if (!this.isBeginner) {
      this.characterService.setRankAndLevel(this.quizService.testSentence.level,this.quizService.testSentence.rank).toPromise()
      .then(() => {
        this.router.navigate(['/']);
      });
    }else if(!event && this.isBeginner){
      swal("try again");
      this.router.navigate(['/']);
    }
  }
}
