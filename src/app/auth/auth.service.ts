import { HttpClient } from '@angular/common/http';
import {Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Language } from '../language.enum';
import { AuthData } from './auth-data.model';
import { User } from './user.model';

@Injectable()
export class AuthService{

    private userLogged = new Subject<User>();
    public user:User;

    constructor(private http:HttpClient){}
    createUser(email:string,password:string, name:string, pic:string, language:Language){
        const user:User = {email,password,name,pic,language,level:1,rank:1,str:10,dex:10,health:10,money:3,equipment:null,skills:null};
        this.http.post("http://localhost:3300/api/users/signup",user )
        .subscribe(response=>{
                console.log(response);
        });
    }
    login(name:string,password:string){
        const authData:AuthData = {name,password};
        this.http.post<{token:any, user:User}>("http://localhost:3300/api/users/login",authData)
        .subscribe(response =>{
            this.user = response.user;
            this.userLogged.next(response.user);
        });
    }
    getUserLoggedIn(){
        return this.userLogged.asObservable();
    }

    getUserById(){
        this.http.post("http://localhost:3300/api/users/byId",this.user)
        .subscribe((user:User) => this.user=user);
    }

    updateRank(){
        this.http.patch("http://localhost:3300/api/users/rank",this.user)
        .subscribe(()=>{
            this.getUserById();
        });
    }

    levelUp(){
        this.http.patch("http://localhost:3300/api/users/level",this.user)
        .subscribe(()=>{
            this.getUserById();
        });
    }
}