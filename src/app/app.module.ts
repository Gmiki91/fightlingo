import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input'
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QuizComponent } from './quiz/quiz.component';
import { QuizService } from './quiz/quiz.service';
import { LevelTreeComponent } from './level-tree/level-tree.component';
import { DojoComponent } from './dojo/dojo.component';
import { LibraryComponent } from './dojo/library/library.component';
import { LoginComponent } from './auth/login/login.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { FormsModule } from '@angular/forms';
import { AuthService } from './auth/auth.service';
import { LessonService } from './level-tree/lesson.service';
import { GymComponent } from './dojo/gym/gym.component';

@NgModule({
  declarations: [
    AppComponent,
    QuizComponent,
    LevelTreeComponent,
    DojoComponent,
    LibraryComponent,
    LoginComponent,
    SignUpComponent,
    GymComponent
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
  ],
  providers: [QuizService, AuthService, LessonService],
  bootstrap: [AppComponent],
})
export class AppModule { }
