import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { CityComponent } from './city/city.component';
import { HomeComponent } from './home/home.component';
import { LibraryComponent } from './home/library/library.component';
import { ConfirmedGuard } from './guards/confirmed.guard';
import { GuildComponent } from './capital/guild/guild.component';
import { ClassroomComponent } from './capital/guild/classroom/classroom.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { LoggedInGuard } from './guards/logged-in.guard';
import { LoggedOutGuard } from './guards/logged-out.guard';
import { IntroComponent } from './auth/intro/intro.component';
import { NotConfirmedGuard } from './guards/not-confirmed.guard';
import { AllPubComponent } from './publications/all-pub/all-pub.component';
import { CharacterSelectorComponent } from './home/character-selector/character-selector.component';
import { ShopComponent } from './city/shop/shop.component';
import { CharacterDetailsComponent } from './home/character-details/character-details.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent, canActivate: [LoggedOutGuard] },
  { path: 'signup', component: SignUpComponent, canActivate: [LoggedOutGuard] },
  { path: 'city', component: CityComponent, canActivate: [ConfirmedGuard] },
  { path: 'shop', component: ShopComponent, canActivate: [ConfirmedGuard] },
  { path: 'character-selector', component: CharacterSelectorComponent, canActivate: [LoggedInGuard] },
  { path: 'character-details', component: CharacterDetailsComponent, canActivate: [LoggedInGuard] },
  { path: 'library', component: LibraryComponent, canActivate: [ConfirmedGuard] },
  { path: 'guild', component: GuildComponent, canActivate: [ConfirmedGuard] },
  { path: 'classroom', component: ClassroomComponent, canActivate: [ConfirmedGuard] },
  { path: 'intro', component: IntroComponent, canActivate: [NotConfirmedGuard] },
  { path: 'publication', component: AllPubComponent, canActivate: [ConfirmedGuard] },
  //  {path:'*', component: NotFoundComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
