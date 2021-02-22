import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import swal from 'sweetalert';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private router: Router) { };
    canActivate(): boolean {
        if (localStorage.getItem('userId')) {
            if (localStorage.getItem('confirmed') === 'true')
                return true;
            else if (localStorage.getItem('confirmed') === 'false'){
                swal("You still have to take your final exam").then(() => {
                    this.router.navigate(['/guild']);
                    return false;
                })
               
            }
        } else {
            this.router.navigate(['/']);
            return false;
        }
    }
}