import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { Observable } from "rxjs";
import { map, take } from "rxjs/operators";
import { CharacterService } from "../shared/services/character.service";

@Injectable({
    providedIn: 'root'
})
export class NotConfirmedGuard implements CanActivate {

    constructor(private router: Router, private characterService: CharacterService) { };
    canActivate(): Observable<boolean> {
        return this.characterService.character$
            .pipe(
                take(1),
                map((char => {
                    if (char && !char.confirmed) {
                        return true;
                    } else {
                        this.router.navigate(['/']);
                        return false;
                    }
                })))
    }
}