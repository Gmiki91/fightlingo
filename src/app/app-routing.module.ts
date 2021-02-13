import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { CityComponent } from './city/city.component';
import { DojoComponent } from './dojo/dojo.component';
import { LibraryComponent } from './dojo/library/library.component';
import { AuthGuardService as AuthGuard} from './services/auth-guard.service';


const routes: Routes = [
  {path:'dojo', component: DojoComponent, canActivate: [AuthGuard]},
  {path:'city', component: CityComponent, canActivate: [AuthGuard]},
  {path:'library', component: LibraryComponent, canActivate: [AuthGuard]},
  {path:'login', component:LoginComponent},
  {path:'sign-up', component:SignUpComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
