import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  private sub: Subscription;
  constructor(private authService: AuthService, private router: Router) { }


  ngOnInit(): void { }

  async onLogin(form: NgForm) {
    await this.authService.login(form.value.username, form.value.password).toPromise();
    this.sub = this.authService.getUpdatedUser().subscribe(user => {
      if (user && user.confirmed)
      this.router.navigate(['/']);
      else if(user && !user.confirmed)
      this.router.navigate(['/guild']);
    })
  }

  ngOnDestroy(): void {
    if (this.sub)
      this.sub.unsubscribe();
  }
}
