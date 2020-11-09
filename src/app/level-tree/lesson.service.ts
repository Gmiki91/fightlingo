import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Lesson } from './lesson.model';

@Injectable()
export class LessonService {

  public numberOfLevels = 6
  
  constructor(private http: HttpClient, private authService:AuthService){}

  getLessons(levelSelected:number){
     return this.http.get<Lesson[]>('http://localhost:3300/api/lessons/'+this.authService.user.language+'/'+levelSelected);
    //  .subscribe(response => {
         // console.log(response);
         // this.lessons.next(response);
    //  });
  }
   
}