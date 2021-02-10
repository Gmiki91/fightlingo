import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService, private router:Router) { }

  ngOnInit(): void {}
  
 async onLogin(form:NgForm){
   await this.authService.login(form.value.username, form.value.password).toPromise();
   if(localStorage.getItem('user'))
        this.router.navigate(['/']);
  }

 
}
