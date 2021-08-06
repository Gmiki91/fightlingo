import { Place } from "./place.enum";

export interface Event{
    id: string;
    name:string;
    group:number;
    overdue:number;
    place:Place;
    from:string;
}