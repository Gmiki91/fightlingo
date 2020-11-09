import { Language } from '../language.enum';

export interface Lesson{
    _id:string;
    masterId:string;
    name:string;
    rank:number;
    language:Language;
    level:number;
}
