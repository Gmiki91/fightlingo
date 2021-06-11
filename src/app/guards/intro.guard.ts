import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { CharacterService } from "../services/character.service";

@Injectable({
    providedIn: 'root'
})
export class IntroGuard implements CanActivate {

    constructor(private router: Router, private characterService:CharacterService) { };
    canActivate(): boolean {
        if (!this.characterService.currentCharConfirmed){
            return true;
        } else {
            this.router.navigate(['/']);
            return false;
        }
    }
}