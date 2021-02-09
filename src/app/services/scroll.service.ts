import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Scroll } from '../models/scroll.model';

@Injectable()
export class ScrollService {
  public numberOfLevels = 7;
  constructor(private http: HttpClient, private authService: AuthService) { }

  getScrolls() {
    return this.http.get<Scroll[]>('http://localhost:3300/api/scrolls/' + this.authService.user.language);
  }

  /* getScrolls(levelSelected: number) {
     return this.http.get<Scroll[]>('http://localhost:3300/api/scrolls/oflevel/' + this.authService.user.language + '/' + levelSelected);
       .subscribe(response => {
      console.log(response);
      this.lessons.next(response);
       });
   }*/
   getScrollByNumber(number: number) {
     return this.http.get<Scroll>('http://localhost:3300/api/scrolls/' + this.authService.user.language + '/' + number);
   }
}
