import { Language } from '../language.enum';

export interface User{
    email:string;
    password:string;
    name:string;
    pic:string;
    language:Language;
    level:number;
    rank:number;
    str:number;
    dex:number;
    health:number;
    money:number;
    equipment:[Object];
    skills:[Object];
}