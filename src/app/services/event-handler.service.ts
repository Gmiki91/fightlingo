import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Event } from "../models/event.model";


@Injectable()
export class EventHandler {
    private readonly BACKEND_URL = environment.apiUrl + '/events/';

    private activeEvents: Event[] = [];
    constructor(private http: HttpClient) { }

    getEventsByLevel() {
        return this.http.get<Event[]>(this.BACKEND_URL)
    }

    addOverdue(event: Event, amount: number) {
        if (this.activeEvents.includes(event)) {
            const index = this.activeEvents.indexOf(event);
            this.activeEvents[index].overdue += amount;
        } else {
            event.overdue += amount;
            this.activeEvents.push(event)
        }
    }

    getActiveEvents(): Event[] {
        return this.activeEvents.filter(event => event.overdue > 0);
    }

    getDialogForEvent(id: string): string {
        return //this.allEvents.find(event => event.id == id).name
    }

    reset(): void {
        this.activeEvents = [];
    }

}