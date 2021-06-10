import { Language } from '../language.enum';

export interface Character{
    _id?:string;
    userId:string;
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
    isReadyForExam:boolean;
    lastLoggedIn:Date;
    lastLecture:Date;
    scrollFinished:Date;
}
