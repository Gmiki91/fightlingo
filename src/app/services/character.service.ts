import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { Character } from "../models/character.model";

const BACKEND_URL = environment.apiUrl + '/characters/';
@Injectable()
export class CharacterService {

    private updatedCharacter = new BehaviorSubject<Character>(null);
    public character$: Observable<Character> = this.updatedCharacter.asObservable();
    public currentCharConfirmed:boolean;
    constructor(private http: HttpClient) { }

    getCharactersByUserId(userId: string) {
        return this.http.get<Character[]>(BACKEND_URL + 'findByUserId/' + userId);
    }

    createCharacter() {
        return this.http.post<{ char: Character, token: string }>(BACKEND_URL + 'create', null).pipe(map(result => {
            localStorage.setItem("token", result.token);
            this.getCurrentCharacter();
            return result.char._id;
        }))
    }

    getCurrentCharacter() {
        this.http.get<{ char: Character, token: string }>(BACKEND_URL + 'currentCharacter').subscribe(result => {
            localStorage.setItem("token", result.token);
            this.updatedCharacter.next(result.char);
            this.currentCharConfirmed=result.char.confirmed;
            localStorage.setItem("userId", result.char.userId);
        })
    }

    confirmCharacter() {
        localStorage.setItem("confirmed", 'true');
        return this.http.patch<Character>(BACKEND_URL + 'confirm', null)
            .pipe(map((char) => {
                this.updatedCharacter.next(char);
            }));
    }

    updateRank() {
        return this.http.patch(BACKEND_URL + 'rank', null)
            .pipe(map(() => {
                this.getCurrentCharacter(); //to refresh token with new rank
            }));
    }

    levelUp() {
        return this.http.patch(BACKEND_URL + 'level', null)
            .pipe(map(() => {
                this.getCurrentCharacter();
            }));
    }

    readyForExam() {
        return this.http.patch(BACKEND_URL + 'readyForExam', null)
            .pipe(map(() => {
                this.getCurrentCharacter();
            }));
    }

    scrollFinishedAt() {
        return this.http.get<Date>(BACKEND_URL + 'finishedAt');
    }

    gaveLecture() {
        return this.http.patch(BACKEND_URL + 'gaveLecture', null)
            .pipe(map(() => {
                this.getCurrentCharacter();
            }));
    }

    giveMoney(id: string, amount: number) {
        return this.http.patch(BACKEND_URL + 'giveMoney', { id: id, amount: amount });
    }

    updateMoney(amount: number) {
        return this.http.patch(BACKEND_URL + 'updateMoney', { amount: amount })
            .pipe(map(() => {
                this.getCurrentCharacter();
            }));
    }
}