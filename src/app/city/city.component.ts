import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Sentence } from '../models/sentence.model';
import { QuizService } from '../services/quiz.service';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css']
})
export class CityComponent implements OnInit {

  overdueAvailable: boolean;
  overdueSentences:Sentence[];
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
        if (sentences && sentences.length != 0){
          this.overdueSentences=sentences;
          this.overdueAvailable = true;
        }else
          this.overdueAvailable = false;
      });
  }

}
