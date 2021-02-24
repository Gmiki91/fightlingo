import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { CityComponent } from './city/city.component';
import { DojoComponent } from './dojo/dojo.component';
import { LibraryComponent } from './dojo/library/library.component';
import { AuthGuard} from './guards/auth.guard';
import { GuildComponent } from './capital/guild/guild.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { GuildGuard } from './guards/guild.guard';
import { DowntownComponent } from './city/downtown/downtown.component';


const routes: Routes = [
  {path:'', component: DojoComponent},
  {path:'login', component:LoginComponent},
  {path:'signup', component:SignUpComponent},
  {path:'guild', component:GuildComponent, canActivate: [GuildGuard]},
  {path:'city', component: CityComponent, canActivate: [AuthGuard]},
  {path:'library', component: LibraryComponent, canActivate: [AuthGuard]},
  {path:'city/downtown', component: DowntownComponent, canActivate:[AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
