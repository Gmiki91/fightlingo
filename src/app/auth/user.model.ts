import { Language } from '../language.enum';

export interface User{
    email:string;
    password:string;
    name:string;
    pic:string;
    language:Language;
    level:number;
    rank:number;
    money:number;
    hasShipTicket:boolean;
    currentStoryId:string;
    lastLoggedIn:Date;
    isPromotionDue:boolean;
}