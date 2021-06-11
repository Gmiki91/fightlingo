import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import swal from 'sweetalert';
import { AuthService } from "../services/auth.service";
import { CharacterService } from "../services/character.service";

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private authService: AuthService, private charachterService: CharacterService) { };
    canActivate(): boolean {
        if (localStorage.getItem("loggedIn")) {
            if (this.charachterService.currentCharConfirmed)
                return true;
            else if (!this.charachterService.currentCharConfirmed) {
                swal("You still have to take your final exam").then(() => {
                    this.router.navigate(['/intro']);
                    return false;
                })
            }
        } else {
            this.router.navigate(['/']);
            return false;
        }
    }
}