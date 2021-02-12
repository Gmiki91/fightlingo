import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'fightlingo';
  loggedIn = false;
  sub = new Subscription();

  constructor(private auth: AuthService) {
  }
  ngOnInit(): void {
    this.sub = this.auth.getUpdatedUser().subscribe(user => {
      this.loggedIn = user == null ? false : true;
    });
  }

  ngOnDestroy(): void {
    if (this.sub)
      this.sub.unsubscribe();
  }
}
