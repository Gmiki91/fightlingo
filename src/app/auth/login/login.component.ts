import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  private sub: Subscription;
  constructor(
    private authService: AuthService, 
    private router: Router,
    public socialAuthService: SocialAuthService
    ) { }


  ngOnInit(): void { }

  onLogin(form: NgForm) {
    this.authService.login(form.value.username, form.value.password).toPromise().then(() => {
      this.sub = this.authService.getUpdatedUser().subscribe(user => {
        if (user && user.confirmed)
          this.router.navigate(['/']);
        else if (user && !user.confirmed)
          this.router.navigate(['/intro']);
      })
    });
  }

  loginWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID)
      .then(() => this.router.navigate(['/']));
  }

  ngOnDestroy(): void {
    if (this.sub)
      this.sub.unsubscribe();
  }

logout():void{

}

  
}