import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { GuildComponent } from './capital/guild/guild.component';
import { CityComponent } from './city/city.component';
import { DojoComponent } from './dojo/dojo.component';
import { LibraryComponent } from './dojo/library/library.component';


const routes: Routes = [
  {path:'dojo', component: DojoComponent},
  {path:'city', component: CityComponent},
  {path:'library', component: LibraryComponent},
  {path:'login', component:LoginComponent},
  {path:'sign-up', component:SignUpComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
