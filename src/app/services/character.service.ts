import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { Language } from "../language.enum";
import { Character } from "../models/character.model";
import { Item } from "../models/items/item.model";
import { Rarity } from "../models/items/rarity.enum";
import { Robe } from "../models/items/robe.model";
import { Staff } from "../models/items/staff.model";
import { Place } from "../models/place.enum";


@Injectable()
export class CharacterService {
    private readonly BACKEND_URL = environment.apiUrl + '/characters/';
    private level = 1;
    private updatedCharacter = new BehaviorSubject<Character>(null);
    private updatedCharacterList = new BehaviorSubject<Character[]>(null);
    public character$: Observable<Character> = this.updatedCharacter.asObservable();
    public characterList$: Observable<Character[]> = this.updatedCharacterList.asObservable();
    constructor(private http: HttpClient) { }

    getCharacters() {
        return this.http.get<Character[]>(this.BACKEND_URL + 'findByUserId').subscribe(list => {
            this.updatedCharacterList.next(list);
        })
    }

    createCharacter(name: string, avatar: string, language: Language) {
        return this.http.post<{ char: Character, token: string }>(this.BACKEND_URL + 'create', { name: name, avatar: avatar, language: language }).pipe(map(result => {
            localStorage.setItem(environment.JWT_TOKEN, result.token);
            this.getCharacters();
            return result.char._id;
        }))
    }

    deleteCharacter(id: string) {
        this.http.delete(`${environment.apiUrl}/progress/` + id).toPromise();
        this.http.delete(this.BACKEND_URL + 'deleteCharacter/' + id).subscribe(() => {
            this.getCharacters();
        })
    }

    getCurrentCharacter() {
        this.http.get<{ char: Character, token: string }>(this.BACKEND_URL + 'currentCharacter').subscribe(result => {
            this.level = result.char.level;
            localStorage.setItem(environment.JWT_TOKEN, result.token);
            this.updatedCharacter.next(result.char);
        })
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

    setRankAndLevel(level: number, rank: number) {
        return this.http.patch(this.BACKEND_URL + 'setRankAndLevel', { level: level, rank: rank })
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

    sellItem(item: Item) {
        this.http.patch(this.BACKEND_URL + 'sell', { item: item }).subscribe(() => {
            this.getCurrentCharacter();
        })
    }

    removeItems(items: Item[]) {
        this.http.patch(this.BACKEND_URL + 'removeItems', { items: items }).subscribe(() => {
            this.getCurrentCharacter();
        })
    }

    repairItem(item: Item) {
        this.http.patch(this.BACKEND_URL + 'repairItem', { item: item }).subscribe(() => {
            this.getCurrentCharacter();
        })
    }

    putInPocket(item: Item) {
        this.http.patch(this.BACKEND_URL + 'putInPocket', { item: item }).subscribe(() => {
            this.getCurrentCharacter();
        })
    }

    removeFromPocket(item: Item) {
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

    staffBroke(staff: Staff) {
        if (staff.rarity === Rarity.COMMON) {
            this.http.patch(this.BACKEND_URL + 'brokeCommonStaff', { item: staff }).subscribe(() => {
                this.getCurrentCharacter();
            })
        } else {
            this.http.patch(this.BACKEND_URL + 'brokeRareStaff', { item: staff }).subscribe(() => {
                this.getCurrentCharacter();
            })
        }

    }

    availablePlaces(): Place[] {
        switch (this.level) {
            case 1:
                return [
                    Place.MEADOW, Place.GARTEN, Place.GUILD_HALL, Place.HARBOR, Place.LIBRARY, Place.TRAINING_CENTER, Place.UNIVERSITY, Place.VILLAGE];
            case 2:
                return [
                    Place.MEADOW, Place.GARTEN, Place.GUILD_HALL, Place.HARBOR, Place.LIBRARY, Place.TRAINING_CENTER, Place.UNIVERSITY, Place.VILLAGE,
                    Place.BARACKS, Place.HAUNTED_HOUSE, Place.PALACE, Place.BLUE_CITY];
            case 3:
                return [
                    Place.MEADOW, Place.GARTEN, Place.GUILD_HALL, Place.HARBOR, Place.LIBRARY, Place.TRAINING_CENTER, Place.UNIVERSITY, Place.VILLAGE,
                    Place.BARACKS, Place.HAUNTED_HOUSE, Place.PALACE, Place.BLUE_CITY,
                    Place.SMITH, Place.HOSPITAL, Place.YELLOW_CITY, Place.CAVE, Place.WOODS
                ];
            case 4:
            case 5:
            case 6:
                return [
                    Place.MEADOW, Place.GARTEN, Place.GUILD_HALL, Place.HARBOR, Place.LIBRARY, Place.TRAINING_CENTER, Place.UNIVERSITY, Place.VILLAGE,
                    Place.BARACKS, Place.HAUNTED_HOUSE, Place.PALACE, Place.BLUE_CITY,
                    Place.SMITH, Place.HOSPITAL, Place.YELLOW_CITY, Place.CAVE, Place.WOODS,
                    Place.OASIS, Place.MOUNTAIN_CAVE, Place.MOUNTAIN_VILLAGE, Place.BEACH

                ];
            case 7:
                return [
                    Place.MEADOW, Place.GARTEN, Place.GUILD_HALL, Place.HARBOR, Place.LIBRARY, Place.TRAINING_CENTER, Place.UNIVERSITY, Place.VILLAGE,
                    Place.BARACKS, Place.HAUNTED_HOUSE, Place.PALACE, Place.BLUE_CITY,
                    Place.SMITH, Place.HOSPITAL, Place.YELLOW_CITY, Place.CAVE, Place.WOODS,
                    Place.OASIS, Place.MOUNTAIN_CAVE, Place.MOUNTAIN_VILLAGE, Place.BEACH,
                    Place.CONSUL
                ];
        }
    }
}
