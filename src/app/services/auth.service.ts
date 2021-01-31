import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Language } from '../language.enum';
import { AuthData } from '../models/auth-data.model';
import { User } from '../models/user.model';

@Injectable()
export class AuthService {

    private userLogged = new Subject<User>();
    public user: User;

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
        this.http.post("http://localhost:3300/api/users/signup", user)
            .subscribe(response => {
                console.log(response);
            });
    }
    login(name: string, password: string) {
        const authData: AuthData = { name, password };
        this.http.post<{ token: any, user: User }>("http://localhost:3300/api/users/login", authData)
            .subscribe(response => {
                this.user = response.user;
                this.userLogged.next(response.user);
            });
    }
    pushUser(){
        this.userLogged.next(this.user);
    }
    getUserLoggedIn() {
        return this.userLogged.asObservable();
    }

    getUserById() {
        this.http.post("http://localhost:3300/api/users/byId", this.user)
            .subscribe((user: User) => {
                this.user = user;
                this.pushUser();
            });
    }

    updateRank() {
        console.log("user", this.user);
        this.http.patch("http://localhost:3300/api/users/rank", this.user)
            .subscribe(() => {
                this.getUserById();
            });
    }

    currentLessonFinished() {
        this.user.currentLessonFinished = new Date();
        this.http.patch("http://localhost:3300/api/users/currentLessonFinished", this.user)
            .subscribe(() => {
                this.getUserById();
            });
    }

    currentStoryLearned() {
        this.user.currentStoryLearned = true;
        this.http.patch("http://localhost:3300/api/users/currentStoryLearned", this.user)
            .subscribe(() => {
                this.getUserById();
            });
    }

    currentStorySent() {
        this.user.currentStorySent = new Date();
        this.http.patch("http://localhost:3300/api/users/currentStorySent", this.user)
            .subscribe(() => {
                this.getUserById();
            });
    }

    currentStoryRecieved() {
        this.user.currentStoryRecieved = true;
        this.http.patch("http://localhost:3300/api/users/currentStoryRecieved", this.user)
            .subscribe(() => {
                this.getUserById();
            });
    }

    currentStoryFinished() {
        this.user.currentStoryFinished = new Date();
        this.http.patch("http://localhost:3300/api/users/currentStoryFinished", this.user)
            .subscribe(() => {
                this.getUserById();
            });
    }

    levelUp() {
        this.http.patch("http://localhost:3300/api/users/level", this.user)
            .subscribe(() => {
                this.getUserById();
            });
    }

}