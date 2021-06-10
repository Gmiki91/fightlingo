import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Character } from "../models/character.model";

const BACKEND_URL = environment.apiUrl + '/characters/';
@Injectable()
export class CharacterService{
    
    private updatedCharacter = new BehaviorSubject<Character>(null);
    public character$ :Observable<Character> = this.updatedCharacter.asObservable();
    constructor(private http: HttpClient){}

    getCharactersByUserId(userId:string){
        return this.http.get<Character[]>(BACKEND_URL+'findByUserId/' + userId);
    }

    getUpdatedCharacter() {
        return this.updatedCharacter.asObservable();
    }

    createCharacter(){
        return this.http.post(BACKEND_URL+'create', null);
    }


}