import { Language } from '../language.enum';

export interface Lesson{
    _id:string;
    name:string;
    rank:number;
    language:Language;
    level:number;
    overview:string;
}
