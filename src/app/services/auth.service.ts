import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthData } from '../models/auth-data.model';
import { User } from '../models/user.model';
import { map } from 'rxjs/operators';
import { SignupForm } from '../models/signupform.model';
import { environment } from 'src/environments/environment';
import { CharacterService } from './character.service';

const BACKEND_URL = environment.apiUrl + '/users/';

@Injectable()
export class AuthService {

    private updatedUser = new BehaviorSubject<User>(null);

    constructor(private http: HttpClient, private charService:CharacterService) { }

    createUser(form: SignupForm) {
        const user: User = {
            email: form.email,
            password: form.password,
            currentCharacter:null
        };
        return this.http.post(BACKEND_URL+'signup', user);
    }

    login(name: string, password: string) {
        const authData: AuthData = { name, password };
        return this.http.post<{ token: string, user: User}>(BACKEND_URL+'login', authData)
            .pipe(map(response => {
             localStorage.setItem("token", response.token);
             if(response.user.currentCharacter){
                this.charService.getCurrentCharacter();
             }
             this.updatedUser.next(response.user);
            }));
    }

    refreshLoggedInUser(userId: string) {
        return this.http.get<{ user: User }>(BACKEND_URL+'findById/' + userId)
            .pipe(map(response => {
                this.updatedUser.next(response.user);
            }))
    }

    selectCurrentCharacter(charId:string){
        this.http.patch(BACKEND_URL+'selectCurrentCharacter',{charId:charId}).subscribe(()=>{
            this.autoAuthUser() // kuka?
        });
    }

    getUpdatedUser() {
        return this.updatedUser.asObservable();
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
}