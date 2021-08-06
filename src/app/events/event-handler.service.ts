import { Injectable } from "@angular/core";
import { Event } from "../models/event.model";
import { Place } from "../models/place.enum";
import eventData from "./events.json";


@Injectable()
export class EventHandler {
    events:Event[] = eventData.map(element=> ({...element,place:element.place as Place, overdue:0}));
    
    readonly allEvents = ["e0101", "e0102", "e0103", "e0104", "e0105", "e0202", "e0203", "e0204", "e0205"];
    readonly level1Events = ["e0101", "e0102", "e0103", "e0104", "e0105"];
    readonly level2Events = ["e0101", "e0102", "e0103", "e0104", "e0105", "e0202", "e0203", "e0204", "e0205"];

    getEventsByLevel(level: number): Event[] {
      /*  switch (level) {
            case 1: return this.level1Events;
            case 2: return this.level2Events;
        }*/
        
        console.log(this.events);
        return null;
    }

    getActiveEvents(): Event[] {
        return //this.allEvents.filter(event => event.overdue > 0);
    }

    getDialogForEvent(id: string): string {
        return //this.allEvents.find(event => event.id == id).name
    }

    reset(): void {
        //this.allEvents.forEach(event => event.overdue = 0);
    }

}