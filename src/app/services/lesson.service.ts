import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthService } from './auth.service';
import { Lesson } from '../models/lesson.model';
import { Story } from '../models/story.model';

@Injectable()
export class LessonService {

  public numberOfLevels = 6
  private review = new Subject<string>();

  constructor(private http: HttpClient, private authService: AuthService) { }

  getLessons(levelSelected: number) {
    return this.http.get<Lesson[]>('http://localhost:3300/api/lessons/oflevel/' + this.authService.user.language + '/' + levelSelected);
    //  .subscribe(response => {
    // console.log(response);
    // this.lessons.next(response);
    //  });
  }
  getStoryByRank(rank: number) {
    return this.http.get<Story>('http://localhost:3300/api/lessons/story/' + this.authService.user.language + '/' + rank);
  }

  getReviewByLessonId(lessonId: string) {
    return this.http.get<string>('http://localhost:3300/api/lessons/overview/' + lessonId)
      .subscribe((review) => {
        this.review.next(review);
      });
  }
  getReview(){
    return this.review.asObservable();
  }


}