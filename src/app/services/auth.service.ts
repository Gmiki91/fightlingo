import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Language } from '../language.enum';
import { AuthData } from '../models/auth-data.model';
import { User } from '../models/user.model';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthService {

    private user: User;
    private updatedUser = new BehaviorSubject<User>(null);

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
                localStorage.setItem("user", JSON.stringify(this.user));
                this.updatedUser.next(response.user);
            }));
    }

    getUpdatedUser(){
        if(!this.updatedUser.value)
            this.updatedUser.next(JSON.parse(localStorage.getItem("user")));
        else
            localStorage.setItem("user", JSON.stringify(this.updatedUser.value))
        this.user=JSON.parse(localStorage.getItem("user")); // ha ezt kikommentezem, update rank után kijelentkezik, az app module null usert kap O_o
        return this.updatedUser.asObservable();
    }

    updateRank() {
       return this.http.patch<User>("http://localhost:3300/api/users/rank", this.user)
           .pipe(map(user => {
            this.updatedUser.next(user);               
            }));
    }

    levelUp() {
        return this.http.patch<User>("http://localhost:3300/api/users/level", this.user)
        .pipe(map(user => {
            this.updatedUser.next(user);
        }));
    }

    logout(){
        localStorage.setItem("user", null);
        this.updatedUser.next(null);
    }

}