import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { CityComponent } from './city/city.component';
import { DojoComponent } from './dojo/dojo.component';
import { LibraryComponent } from './dojo/library/library.component';
import { AuthGuard} from './auth/auth.guard';
import { GuildComponent } from './capital/guild/guild.component';


const routes: Routes = [
  {path:'', component: DojoComponent},
  {path:'login', component:LoginComponent},
  {path:'guild', component:GuildComponent},
  {path:'city', component: CityComponent, canActivate: [AuthGuard]},
  {path:'library', component: LibraryComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
