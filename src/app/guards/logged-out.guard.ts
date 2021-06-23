import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class LoggedOutGuard implements CanActivate {

    constructor(private router: Router) { };
    canActivate(): boolean {
        if (!localStorage.getItem(environment.JWT_TOKEN)) {
            return true;
        }
        else {
            this.router.navigate(['/']);
            return false;
        }
    }
}