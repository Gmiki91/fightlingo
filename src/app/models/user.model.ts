import { Language } from '../language.enum';

export interface User{
    email:string;
    password:string;
    name:string;
    pic:string;
    language:Language;
    level:number;
    rank:number;
    strength:number;
    hitpoint:number;
    money:number;
    confirmed:boolean;
    hasShipTicket:boolean;
    lastLoggedIn:Date;
    scrollFinished:Date;
}