import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthData } from '../models/auth-data.model';
import { User } from '../models/user.model';
import { map } from 'rxjs/operators';
import { SignupForm } from '../models/signupform.model';

@Injectable()
export class AuthService {

    private updatedUser = new BehaviorSubject<User>(null);

    constructor(private http: HttpClient) { }
    createUser(form: SignupForm) {
        const user: User = {
            email: form.email,
            password: form.password,
            name: form.name,
            pic: form.avatar,
            language: form.language,
            confirmed: false,
            isReadyForExam:false,
            strength: 5,
            hitpoint: 10,
            level: 0,
            rank: 0,
            money: 3,
            hasShipTicket: false,
            lastLoggedIn: new Date(),
            lastLecture:null,
            scrollFinished: null
        };
        return this.http.post("http://localhost:3300/api/users/signup", user);
    }

    login(name: string, password: string) {
        const authData: AuthData = { name, password };
        return this.http.post<{ token: string, user: User, userId: string, confirmed: boolean }>("http://localhost:3300/api/users/login", authData)
            .pipe(map(response => {
                localStorage.setItem("token", response.token);
                localStorage.setItem("userId", response.userId);
                localStorage.setItem("confirmed", '' + response.confirmed);
                this.autoAuthUser();
            }));
    }

    refreshLoggedInUser(userId: string) {
        return this.http.get<{ user: User, token: string }>("http://localhost:3300/api/users/findById/" + userId)
            .pipe(map(response => {
                localStorage.setItem("token", response.token);
                this.updatedUser.next(response.user);
            }))
    }

    getUpdatedUser() {
        return this.updatedUser.asObservable();
    }


    confirmUser() {
        localStorage.setItem("confirmed", 'true');
        return this.http.patch("http://localhost:3300/api/users/confirm", null)
            .pipe(map(() => {
                this.autoAuthUser();
            }));
    }

    updateRank() {
        return this.http.patch("http://localhost:3300/api/users/rank", null)
            .pipe(map(() => {
                this.autoAuthUser(); //to refresh token with new rank
            }));
    }

    levelUp() {
        return this.http.patch("http://localhost:3300/api/users/level", null)
            .pipe(map(() => {
                this.autoAuthUser();
            }));
    }

    readyForExam(){
        return this.http.patch("http://localhost:3300/api/users/readyForExam", null)
        .pipe(map(() => {
            this.autoAuthUser();
        }));
    }

    logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("confirmed");
        localStorage.removeItem("hasTicket");
        this.updatedUser.next(null);
    }

    autoAuthUser() {
        const userId = localStorage.getItem('userId');
        if (userId)
            this.refreshLoggedInUser(userId).toPromise();
    }

    scrollFinishedAt() {
        return this.http.get<Date>('http://localhost:3300/api/users/finishedAt');
    }

    gaveLecture(){
        return this.http.patch("http://localhost:3300/api/users/gaveLecture", null)
        .pipe(map(() => {
            this.autoAuthUser();
        }));
    }
}