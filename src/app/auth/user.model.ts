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
    health:number;
    money:number;
    fame:[number,number];
    items:[Object];
}