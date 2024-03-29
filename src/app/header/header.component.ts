import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EventHandler } from '../services/event-handler.service';
import { Event } from '../models/event.model';
import { Sentence } from '../models/sentence.model';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { QuizService } from '../services/quiz.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  warning: boolean;
  loggedIn: boolean;
  overdueSub: Subscription = Subscription.EMPTY;
  userSub: Subscription = Subscription.EMPTY;
  user: User;

  constructor(private quizService: QuizService, private auth: AuthService, private router: Router, private eventHandler: EventHandler) { }

  ngOnInit(): void {
    this.subscribeToOverdue();
    this.subscribeToUser();
  }

  ngOnDestroy(): void {
    if (this.overdueSub)
      this.overdueSub.unsubscribe();
    if (this.userSub)
      this.userSub.unsubscribe();
  }

  logout(): void {
    this.eventHandler.reset();
    this.auth.logout();
    this.router.navigate(['/']);
  }

  onPollyClicked(): void {
    let text;
    if (this.eventHandler.getActiveEvents()[0]) {
      text = this.eventHandler.getActiveEvents()[0].pollyComments[0];
      swal(text);
    }
  }

  private subscribeToUser(): void {
    if (this.userSub)
      this.userSub.unsubscribe();

    this.userSub = this.auth.getUpdatedUser().subscribe(user => {
      if (user) {
        this.quizService.getOverdueSentences().toPromise();
        this.user = user;
        this.loggedIn = true;
      } else {
        this.loggedIn = false;
      }
    });
  }

  private subscribeToOverdue(): void {
    if (this.overdueSub)
      this.overdueSub.unsubscribe();

    this.overdueSub = this.quizService.getOverdueList()
      .subscribe((sentences: Sentence[]) => {
        if (sentences && sentences.length != 0) {
          this.warning = true;
          this.sortEvents(sentences.length);
        } else {
          this.warning = false;
          this.eventHandler.reset();
        }
      });
  }

  private sortEvents(overdues: number) {
    this.eventHandler.reset();
    let count = overdues;
    const events: Event[] = this.eventHandler.getEventsByLevel(this.user.level);
    while (count > 0) {
      let amount = count > 5 ? 5 : count;
      count -= this.addToRandomEvent(amount, events);
    }
    console.log(this.eventHandler.getActiveEvents());
  }

  private addToRandomEvent(amount: number, events: Event[]): number {
    let randomIndex = Math.floor(Math.random() * (events.length));
    if (events[randomIndex].maxOverdue >= events[randomIndex].overdue + amount) {
      events[randomIndex].overdue += amount;
      if (events[randomIndex].eventGroup === 1)
        this.eventHandler.checkGrogsLocation(events[randomIndex].id);
      return amount;
    } else {
      this.addToRandomEvent(amount, events);
    }
  }
}
