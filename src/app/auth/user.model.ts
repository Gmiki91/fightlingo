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
    currentStoryFinished:boolean;
    currentLessonFinished:boolean;
    lastLoggedIn:Date;
}