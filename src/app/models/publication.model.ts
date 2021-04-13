import { Language } from "../language.enum";

export interface Publication{
    userId?:string,
    dateOfPublish?:Date,
    reviewed?:boolean,
    defended?:boolean,
    popularity?:number,
    language?:Language,
    level:number,
    title:string,
    text:string
}