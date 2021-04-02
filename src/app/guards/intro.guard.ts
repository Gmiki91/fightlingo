import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class IntroGuard implements CanActivate {

    constructor(private router: Router) { };
    canActivate(): boolean {
        if (localStorage.getItem('confirmed') === 'false'){
            return true;
        } else {
            this.router.navigate(['/']);
            return false;
        }
    }
}