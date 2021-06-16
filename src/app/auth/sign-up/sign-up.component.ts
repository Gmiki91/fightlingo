import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Language } from 'src/app/language.enum';
import { SignupForm } from 'src/app/models/signupform.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {

  }

   onSignUp(form: NgForm) {
    // check for mail/userename in database for duplicates
    const signupform: SignupForm = {
      email:form.value.email, 
      password:form.value.password,
    /*  name: form.value.fightername, 
      avatar: this.imagePath,
      language: this.language*/
    }
    this.authService.createUser(signupform).toPromise().then(()=>{
      this.router.navigate(['/']);
    });
  }

  
}
