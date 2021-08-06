import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { EventHandler } from '../events/event-handler.service';
import { Event } from '../models/event.model';
import { Sentence } from '../models/sentence.model';
import { AuthService } from '../services/auth.service';
import { QuizService } from '../services/quiz.service';
import swal from 'sweetalert';
import { Character } from '../models/character.model';
import { CharacterService } from '../services/character.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  warningOverdue: boolean;
  warningNoChar: boolean;
  warningCharConfirmed: boolean;
  loggedIn$: Observable<boolean>;

  overdueSub: Subscription = Subscription.EMPTY;
  charSub: Subscription = Subscription.EMPTY;
  char: Character;

  constructor(
    private authService: AuthService,
    private charService: CharacterService,
    private quizService: QuizService,
    private auth: AuthService,
    private router: Router,
    private eventHandler: EventHandler) { }

  ngOnInit(): void {
    this.subscribeToOverdue();
    this.subscribeToUser();
  }

  ngOnDestroy(): void {
    this.overdueSub?.unsubscribe();
    this.charSub?.unsubscribe();
  }

  logout(): void {
    this.eventHandler.reset();
    this.auth.logout();
    this.router.navigate(['/']);
  }

  onPollyClicked(): void {
    let text;
    if (this.eventHandler.getActiveEvents()[0]) {
     // text = this.eventHandler.getActiveEvents()[0].pollyComments[0];
      swal(text);
    }
  }

  private subscribeToUser(): void {
    this.loggedIn$ = this.authService.user$.pipe(map(user => {
      if (user)
        this.warningNoChar = user.currentCharacter ? false : true;
      return user ? true : false;
    }))
    this.charSub = this.charService.character$.subscribe((char: Character) => {
      this.char = char;
      this.warningCharConfirmed = char ? !char.confirmed : null;
      if (char && char.confirmed) {
        this.quizService.getOverdueSentences().toPromise();
      }
    })
  }

  private subscribeToOverdue(): void {
    this.eventHandler.getEventsByLevel(1);
    if (this.overdueSub)
      this.overdueSub.unsubscribe();

    this.overdueSub = this.quizService.getOverdueList()
      .subscribe((sentences: Sentence[]) => {
        if (sentences && sentences.length != 0) {
          this.warningOverdue = true;
          this.sortEvents(sentences.length);
        } else {
          this.warningOverdue = false;
          this.eventHandler.reset();
        }
      });
  }

  private sortEvents(overdues: number) {
    this.eventHandler.reset();
    let count = overdues;
    const events: Event[] = this.eventHandler.getEventsByLevel(this.char.level);
    while (count > 0) {
      let amount = count > 5 ? 5 : count;
      count -= this.addToRandomEvent(amount, events);
    }
    console.log(this.eventHandler.getActiveEvents());
  }

  private addToRandomEvent(amount: number, events: Event[]): number {
    let randomIndex = Math.floor(Math.random() * (events.length));
    const randomEvent = events[randomIndex];
    const tooMuchOverdue = events.length * 10 < amount;  // maxOverdue does not apply in case of too much overdue
    if (environment.MAX_OVERDUE >= randomEvent.overdue + amount || tooMuchOverdue ) {
      randomEvent.overdue += amount;
      return amount;
    } else { 
      events.splice(events.indexOf(randomEvent),1);
      this.addToRandomEvent(amount, events);
    }
  }
}
