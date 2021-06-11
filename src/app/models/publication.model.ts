import { Language } from "../language.enum";

export interface Publication{
    _id?:string;
    characterId?:string,
    dateOfPublish?:Date,
    dateOfLastLecture?:Date,
    reviewed?:boolean,
    popularity?:number,
    language?:Language,
    author?:string
    level:number,
    title:string,
    text:string,
    numberOfQuestions:number
}