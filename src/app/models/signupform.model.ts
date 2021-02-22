import { Language } from "../language.enum";

export interface SignupForm{
    email:string,
    password:string,
    name:string,
    language:Language, 
    avatar:string
}