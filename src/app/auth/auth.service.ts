import { HttpClient } from '@angular/common/http';
import { Token } from '@angular/compiler/src/ml_parser/lexer';
import {Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Language } from '../language.enum';
import { AuthData } from './auth-data.model';
import { User } from './user.model';

@Injectable()
export class AuthService{

    private userLogged = new Subject<User>();
    public userName:string;

    constructor(private http:HttpClient){}
    createUser(name:string,password:string, monster:string, language:Language){
        const user:User = {name,password,monster,language};
        this.http.post("http://localhost:3300/api/users/signup",user )
        .subscribe(response=>{
                console.log(response);
        });
    }
    login(name:string,password:string){
        const authData:AuthData = {name,password};
        this.http.post<{token:any, user:User}>("http://localhost:3300/api/users/login",authData)
        .subscribe(response =>{
            this.userName=response.user.name.toString();
            this.userLogged.next(response.user);
        });
    }
    getUserLoggedIn(){
        return this.userLogged.asObservable();
    }
}