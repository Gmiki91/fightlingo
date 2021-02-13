import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private auth: AuthService, private router: Router) {
  }
  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    if(userId){
      this.auth.getLoggedInUser(userId).toPromise();
    }
    this.sub = this.auth.getUpdatedUser().subscribe(user => {
      this.loggedIn = user ? true : false;
      if(this.loggedIn)
        this.router.navigate(['/dojo']);
    });
  }

  ngOnDestroy(): void {
    if (this.sub)
      this.sub.unsubscribe();
  }
}
