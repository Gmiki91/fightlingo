import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthData } from '../models/auth-data.model';
import { User } from '../models/user.model';
import { map } from 'rxjs/operators';
import { SignupForm } from '../models/signupform.model';
import { environment } from 'src/environments/environment';
import { CharacterService } from './character.service';


@Injectable()
export class AuthService {
    private readonly BACKEND_URL = environment.apiUrl + '/users/';
    private updatedUser = new BehaviorSubject<User>(null);
    public hasCharacter: boolean;

    constructor(private http: HttpClient, private charService: CharacterService) { }

    createUser(form: SignupForm) {
        const user: User = {
            email: form.email,
            password: form.password,
            currentCharacter: null
        };
        return this.http.post(this.BACKEND_URL + 'signup', user);
    }

    login(email: string, password: string) {
        const authData: AuthData = { email, password };
        return this.http.post<{ token: string, user: User }>(this.BACKEND_URL + 'login', authData)
            .pipe(map(response => {
                this.hasCharacter = response.user.currentCharacter!=null;
                localStorage.setItem(environment.JWT_TOKEN, response.token);
                this.updateCurrentCharacter(response.user);
            }));
    }

    refreshUser() {
        return this.http.get<{ token: string, user: User }>(this.BACKEND_URL + 'refreshUser')
            .pipe(map(response => {
                this.hasCharacter = response.user.currentCharacter!=null;
                localStorage.setItem(environment.JWT_TOKEN, response.token);
                this.updateCurrentCharacter(response.user);
            }))
    }

    selectCurrentCharacter(charId: string) {
        this.http.patch(this.BACKEND_URL + 'selectCurrentCharacter', { charId: charId }).subscribe(() => {
            this.refreshUser().toPromise();
        });
    }

    getUpdatedUser() {
        return this.updatedUser.asObservable();
    }

    logout() {
        localStorage.removeItem(environment.JWT_TOKEN);
        this.updatedUser.next(null);
    }

    private updateCurrentCharacter(user:User){
        if (user.currentCharacter) {
            this.charService.getCurrentCharacter();
        }
        this.updatedUser.next(user);
    }
}