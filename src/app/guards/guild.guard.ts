import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class GuildGuard implements CanActivate {

    constructor(private router: Router) { };
    canActivate(): boolean {
        if (localStorage.getItem('userId') && localStorage.getItem('confirmed') === 'false' /* || hasTicket */)
            return true;
        else {
            this.router.navigate(['/']);
            return false;
        }
    }
}