import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EventHandler } from '../models/events/eventHandler.model';
import { Event } from '../models/events/event.model';
import { Sentence } from '../models/sentence.model';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { QuizService } from '../services/quiz.service';

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
  eventHandler: EventHandler = new EventHandler();
  user: User;

  constructor(private quizService: QuizService, private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.userSub = this.auth.getUpdatedUser().subscribe(user => {
      if (user) {
        this.user = user;
        this.loggedIn = true;
        this.subscribeToOverdue();
        this.quizService.getOverdueSentences().toPromise();
      } else {
        this.loggedIn = false;
      }
    });

  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }

  private subscribeToOverdue(): void {
    if (this.overdueSub) {
      this.overdueSub.unsubscribe();
    }
    this.overdueSub = this.quizService.getOverdueList()
      .subscribe((sentences: Sentence[]) => {
        if (sentences && sentences.length != 0) {
          this.warning = true;
          this.sortEvents(sentences.length);
        } else
          this.warning = false;
      });
  }
  ngOnDestroy(): void {
    if (this.overdueSub)
      this.overdueSub.unsubscribe();
    if (this.userSub)
      this.userSub.unsubscribe();
  }

  private sortEvents(overdues: number) {

    let count = overdues;
    const events: Event[] = this.eventHandler.getEventsByLevel(this.user.level);
    while (count > 0) {
     let amount = count>5 ? 5 : count;
     count -= this.addToRandomEvent(amount, events);
    }
    console.log(this.eventHandler.getActiveEvents());
  }

  private addToRandomEvent(amount: number, events: Event[]): number {
    console.log("fut");
    let randomIndex = Math.floor(Math.random() * (events.length));
    if (events[randomIndex].maxOverdue >= events[randomIndex].overdue + amount) {
      events[randomIndex].overdue += amount;
      return  amount;
    } else {
      this.addToRandomEvent(amount, events);
    }
  }
}
