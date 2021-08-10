import { Npc } from "./npc.enum";
import { Place } from "./place.enum";

export interface Event{
    _id: string;
    name:string;
    group:number;
    overdue:number;
    place:Place;
    from:Npc;
}