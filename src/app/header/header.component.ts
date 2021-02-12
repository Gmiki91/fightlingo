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
  overdueSubscription: Subscription = Subscription.EMPTY;
  constructor(private quizService: QuizService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.subscribeToOverdue();
    this.quizService.getOverdueSentences().toPromise();
  }

  logout():void{
    this.authService.logout();
    this.router.navigate(['/']);
  }

  private subscribeToOverdue(): void {
    if (this.overdueSubscription) {
      this.overdueSubscription.unsubscribe();
    }
    this.overdueSubscription = this.quizService.getOverdueList()
      .subscribe((sentences: Sentence[]) => {
        if (sentences && sentences.length != 0)
          this.warning = true;
        else
          this.warning = false;
      });
  }
  ngOnDestroy(): void {
    if(this.overdueSubscription)
    this.overdueSubscription.unsubscribe();
  }
}
