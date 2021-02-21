import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Language } from '../language.enum';
import { AuthData } from '../models/auth-data.model';
import { User } from '../models/user.model';
import { map } from 'rxjs/operators';
import { SignupForm } from '../models/signupform.model';

@Injectable()
export class AuthService {

    private updatedUser = new BehaviorSubject<User>(null);

    constructor(private http: HttpClient) { }
    createUser(form:SignupForm) {
        const user: User = {
            email:form.email,
            password:form.password,
            name:form.name,
            pic:form.avatar,
            language:form.language,
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
        return this.http.post<{ token: string, user: User, userId: string, introDone:string }>("http://localhost:3300/api/users/login", authData)
            .pipe(map(response => {
                localStorage.setItem("token", response.token);
                localStorage.setItem("userId", response.userId);
                this.updatedUser.next(response.user);
            }));
    }

    refreshLoggedInUser(userId: string) {
        return this.http.get<{user:User, token:string}>("http://localhost:3300/api/users/" + userId)
            .pipe(map(response => {
                localStorage.setItem("token", response.token);
                this.updatedUser.next(response.user);
            }))
    }

    getUpdatedUser() {
        return this.updatedUser.asObservable();
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

    logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        this.updatedUser.next(null);
    }

    autoAuthUser() {
        const userId = localStorage.getItem('userId');
        if (userId)
            this.refreshLoggedInUser(userId).toPromise();
    }
}