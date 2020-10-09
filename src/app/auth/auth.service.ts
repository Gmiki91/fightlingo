import { HttpClient } from '@angular/common/http';
import {Injectable } from '@angular/core';
import { AuthData } from './auth-data.model';

@Injectable()
export class AuthService{

    constructor(private http:HttpClient){}
    createUser(name:string,password:string){
        const authData:AuthData = {name,password};
        this.http.post("http://localhost:3300/api/users/signup", authData)
            .subscribe(response=>{
                console.log(response);
            })
    }
}