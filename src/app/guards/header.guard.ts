import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Injectable({
    providedIn: 'root'
})
export class HeaderGuard implements CanActivate {

    constructor(private router: Router, private authService: AuthService) { };
    canActivate(): boolean {
        if (!localStorage.getItem("loggedIn")) {
            return true;
        }
        else {
            this.router.navigate(['/']);
            return false;
        }
        /*
        if (!localStorage.getItem('userId')) {
            return true;
        } else {
            this.router.navigate(['/']);
            return false;
        }*/
    }
}