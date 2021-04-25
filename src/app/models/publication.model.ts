import { Language } from "../language.enum";

export interface Publication{
    _id?:string;
    userId?:string,
    dateOfPublish?:Date,
    reviewed?:boolean,
    popularity?:number,
    language?:Language,
    level:number,
    title:string,
    text:string
}