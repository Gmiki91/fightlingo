import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  
  title = 'fightlingo';
  loggedIn = false;
  routerSubscription = new Subscription();

  constructor(private router:Router){  
  }
  ngOnInit():void{
    this.loggedIn = localStorage.getItem('user') ? true:false;
    this.routerSubscription=this.router.events.subscribe(
      event => {
        if (event instanceof NavigationStart && event['url'] ==='/'){
         this.loggedIn = localStorage.getItem('user') ? true:false;
          if(this.loggedIn){
          this.router.navigate(['dojo']);
          }
      }});
    }

    ngOnDestroy():void{
      this.routerSubscription.unsubscribe();
    }
}
