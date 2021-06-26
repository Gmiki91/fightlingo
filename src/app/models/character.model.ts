import { Language } from '../language.enum';
import { ItemBox } from './items/itembox.model';

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
    equippedStaff:string,
    equippedRobe:string,
    items:ItemBox[],
    brokens:string[],
    confirmed:boolean;
    hasShipTicket:boolean;
    isReadyForExam:boolean;
    lastLoggedIn:Date;
    lastLecture:Date;
    scrollFinished:Date;
}
