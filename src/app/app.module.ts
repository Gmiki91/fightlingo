import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input'
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import {MatExpansionModule} from '@angular/material/expansion';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QuizComponent } from './quiz/quiz.component';
import { QuizService } from './services/quiz.service';
import { DojoComponent } from './dojo/dojo.component';
import { LibraryComponent } from './dojo/library/library.component';
import { LoginComponent } from './auth/login/login.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { FormsModule } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { ScrollService } from './services/scroll.service';
import { CityComponent } from './city/city.component';
import { HeaderComponent } from './header/header.component';
import { CapitalComponent } from './capital/capital.component';
import { GuildComponent } from './capital/guild/guild.component';
import { GymComponent } from './capital/guild/gym/gym.component';
import { AuthInterceptor } from './auth/auth-interceptor';
import { EventHandler } from './services/event-handler.service';
import { DialogService } from './services/dialog.service';
import { IntroComponent } from './auth/intro/intro.component';
import { OwnPubComponent } from './publications/own-pub/own-pub.component';
import { AllPubComponent } from './publications/all-pub/all-pub.component';
import { PublicationService } from './services/publication.service';

@NgModule({
  declarations: [
    AppComponent,
    QuizComponent,
    DojoComponent,
    LibraryComponent,
    LoginComponent,
    SignUpComponent,
    CityComponent,
    HeaderComponent,
    CapitalComponent,
    GuildComponent,
    GymComponent,
    IntroComponent,
    OwnPubComponent,
    AllPubComponent,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatButtonToggleModule,
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatCheckboxModule,
    MatExpansionModule
  ],
  providers: [QuizService,
    AuthService,
    ScrollService,
    DialogService,
    EventHandler,
    PublicationService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi:true }],
  bootstrap: [AppComponent],
})
export class AppModule { }
