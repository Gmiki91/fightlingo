import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { ArenaComponent } from './dojo/arena/arena.component';
import { GmDojoComponent } from './dojo/city/gm-dojo/gm-dojo.component';
import { DojoComponent } from './dojo/dojo.component';
import { GymComponent } from './dojo/gym/gym.component';
import { LibraryComponent } from './dojo/library/library.component';


const routes: Routes = [
  {path:'dojo', component: DojoComponent},
  {path:'gmDojo', component:GmDojoComponent},
  {path:'gym', component: GymComponent},
  {path:'library', component: LibraryComponent},
  {path:'arena', component: ArenaComponent},
  {path:'login', component:LoginComponent},
  {path:'sign-up', component:SignUpComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
