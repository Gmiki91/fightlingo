import { Language } from '../language.enum';

export interface Scroll{
    _id:string,
    title:string,
    number:number,
    grammar:string,
    language:Language,
    level:number,
}
