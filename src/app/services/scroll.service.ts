import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Scroll } from '../models/scroll.model';
import { environment } from 'src/environments/environment';
 
@Injectable()
export class ScrollService {
  private readonly BACKEND_URL = environment.apiUrl + '/scrolls/';

  constructor(private http: HttpClient) {}

  getScrolls() {
    return this.http.get<Scroll[]>(this.BACKEND_URL+'all');
  }

  /* getScrolls(levelSelected: number) {
     return this.http.get<Scroll[]>('http://localhost:3300/api/scrolls/oflevel/' + this.authService.user.language + '/' + levelSelected);
       .subscribe(response => {
      console.log(response);
      this.lessons.next(response);
       });
   }*/
   getOneScroll(number: number) {
     return this.http.get<Scroll>(this.BACKEND_URL+'one/' + number);
   }
}
