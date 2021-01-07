import { Language } from '../language.enum';

export interface Scroll{
    _id:string,
    title:string,
    content:string,
    translation:string,
    questions:string[];
    answers:string[][],
    storyNumber:number,
    language:Language,
    level:number,
}
