import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { AuthInterceptor } from './auth/auth-interceptor';
import { GoogleLoginProvider, SocialLoginModule } from 'angularx-social-login';
import { NgMaterialModules } from './shared/material.module';
import { GameComponents } from './shared/game.components';
import { Pipes } from './shared/pipes';
import { Services } from './shared/services';


@NgModule({
  declarations: [
    AppComponent,
    GameComponents,
    Pipes,

  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SocialLoginModule,
    NgMaterialModules
  ],
  providers: [
    Services,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: true, //keeps the user signed in
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('584741243002-kkpcup8la9lvuv7f03hj147ggjcrpvj8.apps.googleusercontent.com') // your client id
          }
        ]
      }
    }],
  bootstrap: [AppComponent],
})
export class AppModule { }
