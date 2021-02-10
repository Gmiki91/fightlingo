import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './services/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{
  
  title = 'fightlingo';
  loggedIn = false;
  private subscription:Subscription;

  constructor(private authService:AuthService){  
  }
  ngOnInit():void{

    this.authService.getUserLoggedIn()
    .pipe(map(() => console.log("helló"))

    )
    this.subscription=this.authService.getUserLoggedIn()
    .subscribe((user)=>this.loggedIn = user ? true:false);
  }
  ngOnDestroy():void{
    this.subscription.unsubscribe();
  }
}
