import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { CityComponent } from './city/city.component';
import { HomeComponent } from './home/home.component';
import { LibraryComponent } from './home/library/library.component';
import { AuthGuard } from './guards/auth.guard';
import { GuildComponent } from './capital/guild/guild.component';
import { ClassroomComponent } from './capital/guild/classroom/classroom.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { GuildGuard } from './guards/guild.guard';
import { HeaderGuard } from './guards/header.guard';
import { IntroComponent } from './auth/intro/intro.component';
import { IntroGuard } from './guards/intro.guard';
import { AllPubComponent } from './publications/all-pub/all-pub.component';
import { CharacterSelectorComponent } from './home/character-selector/character-selector.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent, canActivate: [HeaderGuard] },
  { path: 'signup', component: SignUpComponent, canActivate: [HeaderGuard] },
  { path: 'city', component: CityComponent, canActivate: [AuthGuard] },
  { path: 'character-selector', component: CharacterSelectorComponent, canActivate: [GuildGuard] },
  { path: 'library', component: LibraryComponent, canActivate: [AuthGuard] },
  { path: 'guild', component: GuildComponent, canActivate: [AuthGuard] },
  { path: 'classroom', component: ClassroomComponent, canActivate: [AuthGuard] },
  { path: 'intro', component: IntroComponent, canActivate: [IntroGuard] },
  { path: 'publication', component: AllPubComponent, canActivate: [AuthGuard] },
  //  {path:'*', component: NotFoundComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
