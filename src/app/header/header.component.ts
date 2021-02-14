import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Sentence } from '../models/sentence.model';
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
  constructor(private quizService: QuizService, private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.userSub = this.auth.getUpdatedUser().subscribe(user => {
      if (user) {
        this.loggedIn = true;
        this.subscribeToOverdue();
        this.quizService.getOverdueSentences().toPromise();
      } else {
        this.loggedIn = false;
      }
    });
    
  }

  logout():void{
    this.auth.logout();
    this.router.navigate(['/']);
  }

  private subscribeToOverdue(): void {
    if (this.overdueSub) {
      this.overdueSub.unsubscribe();
    }
    this.overdueSub = this.quizService.getOverdueList()
      .subscribe((sentences: Sentence[]) => {
        if (sentences && sentences.length != 0)
          this.warning = true;
        else
          this.warning = false;
      });
  }
  ngOnDestroy(): void {
    if(this.overdueSub)
    this.overdueSub.unsubscribe();
    if(this.userSub)
    this.userSub.unsubscribe();
  }
}
