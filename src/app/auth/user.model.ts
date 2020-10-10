import { Language } from '../language.enum';

export interface User{
    name:string;
    password:string;
    monster:string;
    language:Language;
}