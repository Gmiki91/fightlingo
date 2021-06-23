import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { CharacterService } from "../services/character.service";

@Injectable({
    providedIn: 'root'
})
export class NotConfirmedGuard implements CanActivate {

    constructor(private router: Router, private characterService:CharacterService, private authService:AuthService) { };
    canActivate(): boolean {
        if (this.authService.hasCharacter && !this.characterService.currentCharConfirmed){
            return true;
        } else {
            this.router.navigate(['/']);
            return false;
        }
    }
}