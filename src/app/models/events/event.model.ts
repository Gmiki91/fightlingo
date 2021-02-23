import { District } from "src/app/city/district.enum";

export interface Event{
    id: string;
    name:string;
    eventGroup:number;
    level:number;
    overdue:number;
    maxOverdue:number;
    district:District;

}