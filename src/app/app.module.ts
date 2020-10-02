import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonToggleModule} from '@angular/material/button-toggle';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QuizComponent } from './quiz/quiz.component';
import { QuizService } from './quiz/quiz.service';
import { LevelTreeComponent } from './level-tree/level-tree.component';

@NgModule({
  declarations: [
    AppComponent,
    QuizComponent,
    LevelTreeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatButtonToggleModule
  ],
  providers: [QuizService],
  bootstrap: [AppComponent]
})
export class AppModule { }
