import { Language } from '../language.enum';

export interface Master{
    name: string;
    pic:string;
    rank:number;
    level:number;
    str:number;
    dex:number;
    health:number;
    gm:boolean;
    language:Language;
    gift_id:string;
}
