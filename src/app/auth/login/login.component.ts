import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  private subscription:Subscription=Subscription.EMPTY;

  constructor(private authService: AuthService, private router:Router) { }

  ngOnInit(): void {
    
  }
  
  onLogin(form:NgForm){
    this.authService.login(form.value.username, form.value.password);
    this.subscription= this.authService.getUserLoggedIn()
    .subscribe((user)=>{
      if(user){
        this.router.navigate(['dojo']);
      }
    })
  }

  ngOnDestroy():void{
    this.subscription.unsubscribe();
  }
}
