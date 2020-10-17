import { Language } from '../language.enum';
import { Sentence } from '../quiz/sentence.model';

export interface User{
    name:string;
    password:string;
    monster:string;
    level:number;
    language:Language;
    sentences:Array<Sentence>;
}