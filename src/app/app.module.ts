import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QuizComponent } from './quiz/quiz.component';
import { QuizService } from './services/quiz.service';
import { HomeComponent } from './home/home.component';
import { LibraryComponent } from './home/library/library.component';
import { LoginComponent } from './auth/login/login.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { FormsModule } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { ScrollService } from './services/scroll.service';
import { WorldmapComponent } from './worldmap/worldmap.component';
import { HeaderComponent } from './header/header.component';
import { GuildComponent } from './guild/guild.component';
import { GymComponent } from './guild/gym/gym.component';
import { AuthInterceptor } from './auth/auth-interceptor';
import { EventHandler } from './services/event-handler.service';
import { IntroComponent } from './auth/intro/intro.component';
import { OwnPubComponent } from './publications/own-pub/own-pub.component';
import { AllPubComponent } from './publications/all-pub/all-pub.component';
import { PublicationService } from './services/publication.service';
import { ClassroomComponent } from './guild/classroom/classroom.component';
import { QuestionTemplateComponent } from './publications/question-template/question-template.component';
import {GoogleLoginProvider, SocialLoginModule} from 'angularx-social-login';
import { DateAgoPipe } from './publications/pipes/date-ago.pipe';
import { MoneyPipe } from './publications/pipes/money.pipe copy';
import { TimeLeftPipe } from './publications/pipes/time-left.pipe';
import { TimeLeftTitlePipe } from './publications/pipes/time-left-title.pipe';
import { CharacterService } from './services/character.service';
import { CharacterSelectorComponent } from './home/character-selector/character-selector.component';
import { ItemService } from './services/item.service';
import { ShopComponent } from './worldmap/shop/shop.component';
import { CharacterDetailsComponent } from './home/character-details/character-details.component';
import { NgMaterialModules } from './material.module';


@NgModule({
  declarations: [
    AppComponent,
    QuizComponent,
    HomeComponent,
    LibraryComponent,
    LoginComponent,
    SignUpComponent,
    WorldmapComponent,
    HeaderComponent,
    GuildComponent,
    GymComponent,
    IntroComponent,
    OwnPubComponent,
    AllPubComponent,
    ClassroomComponent,
    QuestionTemplateComponent,
    CharacterSelectorComponent,
    CharacterDetailsComponent,
    ShopComponent,
    DateAgoPipe,
    MoneyPipe,
    TimeLeftPipe,
    TimeLeftTitlePipe,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgMaterialModules,
    SocialLoginModule
  ],
  providers: [QuizService,
    AuthService,
    ScrollService,
    EventHandler,
    PublicationService,
    CharacterService,
    ItemService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi:true },
    {provide: 'SocialAuthServiceConfig',
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
