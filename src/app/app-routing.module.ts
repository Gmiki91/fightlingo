import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LibraryComponent } from './dojo/library/library.component';
import { QuizComponent } from './quiz/quiz.component';

const routes: Routes = [
  {path:'gym', component: QuizComponent},
  {path:'library', component: LibraryComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
