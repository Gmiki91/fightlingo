import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Sentence } from '../models/sentence.model';
import { QuizService } from '../services/quiz.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  warning: boolean;
  overdueSubscription: Subscription = Subscription.EMPTY;
  constructor(private quizService: QuizService) { }

  ngOnInit(): void {
    this.subscribeToOverdue();

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

}
