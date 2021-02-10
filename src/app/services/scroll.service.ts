import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Scroll } from '../models/scroll.model';
import { User } from '../models/user.model';

@Injectable()
export class ScrollService {
  public numberOfLevels = 7;
  private user:User;
  constructor(private http: HttpClient, private auth: AuthService) {
    this.auth.getUpdatedUser().subscribe((user:User)=>this.user = user);
    if(!this.user)
      this.user=JSON.parse(localStorage.getItem('user'));
   }

  getScrolls() {
    return this.http.get<Scroll[]>('http://localhost:3300/api/scrolls/' + this.user.language);
  }

  /* getScrolls(levelSelected: number) {
     return this.http.get<Scroll[]>('http://localhost:3300/api/scrolls/oflevel/' + this.authService.user.language + '/' + levelSelected);
       .subscribe(response => {
      console.log(response);
      this.lessons.next(response);
       });
   }*/
   getScrollByNumber(number: number) {
     return this.http.get<Scroll>('http://localhost:3300/api/scrolls/' + this.user.language + '/' + number);
   }
}
