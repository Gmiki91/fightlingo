import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { first, map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { Language } from "../language.enum";
import { Character } from "../models/character.model";
import { Item } from "../models/items/item.model";
import { Robe } from "../models/items/robe.model";
import { Staff } from "../models/items/staff.model";
import { ItemService } from "./item.service";


@Injectable()
export class CharacterService {
    private readonly BACKEND_URL = environment.apiUrl + '/characters/';

    private updatedCharacter = new BehaviorSubject<Character>(null);
    private updatedCharacterList = new BehaviorSubject<Character[]>(null);
    public character$: Observable<Character> = this.updatedCharacter.asObservable();
    public characterList$: Observable<Character[]> = this.updatedCharacterList.asObservable();
    public currentCharConfirmed: boolean;
    constructor(private http: HttpClient, private itemService: ItemService) { }

    getCharactersByUserId() {
        return this.http.get<Character[]>(this.BACKEND_URL + 'findByUserId').subscribe(list => {
            this.updatedCharacterList.next(list);
        })
    }

    createCharacter(name: string, avatar: string, language: Language) {
        return this.http.post<{ char: Character, token: string }>(this.BACKEND_URL + 'create', { name: name, avatar: avatar, language: language }).pipe(map(result => {
            localStorage.setItem(environment.JWT_TOKEN, result.token);
            this.getCharactersByUserId();
            return result.char._id;
        }))
    }

    getCurrentCharacter() {
        this.http.get<{ char: Character, token: string }>(this.BACKEND_URL + 'currentCharacter' ).subscribe(result => {
            localStorage.setItem(environment.JWT_TOKEN, result.token);
            this.updatedCharacter.next(result.char);
            this.currentCharConfirmed=result.char.confirmed;
        })
    }

    confirmCharacter() {
        return this.http.patch<Character>(this.BACKEND_URL + 'confirm', null)
            .pipe(map((char) => {
                this.updatedCharacter.next(char);
            }));
    }

    updateRank() {
        return this.http.patch(this.BACKEND_URL + 'rank', null)
            .pipe(map(() => {
                this.getCurrentCharacter(); //to refresh token with new rank
            }));
    }

    levelUp() {
        return this.http.patch(this.BACKEND_URL + 'level', null)
            .pipe(map(() => {
                this.getCurrentCharacter();
            }));
    }

    readyForExam() {
        return this.http.patch(this.BACKEND_URL + 'readyForExam', null)
            .pipe(map(() => {
                this.getCurrentCharacter();
            }));
    }

    scrollFinishedAt() {
        return this.http.get<Date>(this.BACKEND_URL + 'finishedAt');
    }

    gaveLecture() {
        return this.http.patch(this.BACKEND_URL + 'gaveLecture', null)
            .pipe(map(() => {
                this.getCurrentCharacter();
            }));
    }

    giveMoney(id: string, amount: number) {
        return this.http.patch(this.BACKEND_URL + 'giveMoney', { id: id, amount: amount });
    }

    updateMoney(amount: number) {
        return this.http.patch(this.BACKEND_URL + 'updateMoney', { amount: amount })
            .pipe(map(() => {
                this.getCurrentCharacter();
            }));
    }

    buyItem(item: Item) {
        this.http.patch(this.BACKEND_URL + 'buy', { item: item }).subscribe(() => {
            this.getCurrentCharacter();
        })
    }

    putInPocket(item:Item){
        this.http.patch(this.BACKEND_URL + 'putInPocket', { item: item }).subscribe(() => {
            this.getCurrentCharacter();
        })
    }

    removeFromPocket(item:Item){
        this.http.patch(this.BACKEND_URL + 'removeFromPocket', { item: item }).subscribe(() => {
            this.getCurrentCharacter();
        })
    }
    equipRobe(item: Robe) {
        this.http.patch(this.BACKEND_URL + 'equipRobe', { item: item }).subscribe(() => {
            this.getCurrentCharacter();
        })
    }
  
    equipStaff(item: Item) {
        this.http.patch(this.BACKEND_URL + 'equipStaff', { item: item }).subscribe(() => {
            this.getCurrentCharacter();
        })
    }

}
