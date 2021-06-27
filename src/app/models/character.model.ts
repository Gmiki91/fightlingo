import { Language } from '../language.enum';
import { Potion } from './items/potion.model';
import { Robe } from './items/robe.model';
import { Staff } from './items/staff.model';

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
    equippedStaff:Staff,
    equippedRobe:Robe,
    pocket:Potion[],
    items:string[],
    brokens:string[],
    confirmed:boolean;
    hasShipTicket:boolean;
    isReadyForExam:boolean;
    lastLoggedIn:Date;
    lastLecture:Date;
    scrollFinished:Date;
}
