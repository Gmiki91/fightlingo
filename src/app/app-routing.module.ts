import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { LibraryComponent } from './dojo/library/library.component';
import { QuizComponent } from './quiz/quiz.component';

const routes: Routes = [
  {path:'gym', component: QuizComponent},
  {path:'library', component: LibraryComponent},
  {path:'login', component:LoginComponent},
  {path:'sign-up', component:SignUpComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
