import { Language } from "../language.enum";

export interface SignupForm{
    beginner:boolean,
    email:string,
    password:string,
    name:string,
    language:Language, 
    avatar:string
}