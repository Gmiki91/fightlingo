import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Language } from '../language.enum';
import { AuthData } from '../models/auth-data.model';
import { User } from '../models/user.model';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthService {

    private userLogged = new Subject<User>();
    private user: User;

    constructor(private http: HttpClient) { }

    createUser(email: string, password: string, name: string, pic: string, language: Language) {
        const user: User = {
            email, password, name, pic, language,
            level: 1,
            rank: 1,
            money: 3,
            hasShipTicket: false,
            currentStoryLearned: false,
            currentStorySent: null,
            currentStoryRecieved: false,
            currentStoryFinished: null,
            currentLessonFinished: null,
            lastLoggedIn: new Date()
        };
       return this.http.post("http://localhost:3300/api/users/signup", user);
           
    }
    
    login(name: string, password: string) {
        const authData: AuthData = { name, password };
        return this.http.post<{ token: any, user: User }>("http://localhost:3300/api/users/login", authData)
            .pipe(map(response => {
                this.user = response.user;
                this.userLogged.next(response.user);
                return this.user;
            }));
    }

    getUserLoggedIn() {
        return this.userLogged.asObservable();
    }

    getUser() {
        return this.user;
    }

    updateRank() {
       return this.http.patch<User>("http://localhost:3300/api/users/rank", this.user)
           .pipe(map(user => {
                this.user = user;
            }));
    }

    levelUp() {
        return this.http.patch<User>("http://localhost:3300/api/users/level", this.user)
        .pipe(map(user => {
            this.user = user;
        }));
    }
}