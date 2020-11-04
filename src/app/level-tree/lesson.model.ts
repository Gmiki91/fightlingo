import { Language } from '../language.enum';

export interface Lesson{
    masterId:string;
    name:string;
    rank:number;
    language:Language;
    level:number;
}
