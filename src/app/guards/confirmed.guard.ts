import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { Observable } from "rxjs";
import { map, take } from "rxjs/operators";
import { environment } from "src/environments/environment";
import swal from 'sweetalert';
import { CharacterService } from "../services/character.service";

@Injectable({
    providedIn: 'root'
})
export class ConfirmedGuard implements CanActivate {

    constructor(private router: Router, private charachterService: CharacterService) { };
    canActivate(): Observable<boolean> {
        if (localStorage.getItem(environment.JWT_TOKEN)) {
            return this.charachterService.character$
                .pipe(
                    take(1),
                    map((char => {
                        if (char && char.confirmed) {
                            return true;
                        } else {
                            this.router.navigate(['/']);
                            return false;
                        }
                    })))
        } else {
            swal("You are not logged in!").then(() => {
                this.router.navigate(['/']);
                return false;
            })
        }

    }
}
