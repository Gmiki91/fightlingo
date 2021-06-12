import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Injectable({
    providedIn: 'root'
})
export class HeaderGuard implements CanActivate {

    constructor(private router: Router, private authService: AuthService) { };
    canActivate(): boolean {
        if (!localStorage.getItem("token")) {
            return true;
        }
        else {
            this.router.navigate(['/']);
            return false;
        }
    }
}