import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Event } from "../models/event.model";
import { Script } from "../models/script.model";


@Injectable()
export class EventHandler {
    private readonly BACKEND_URL = environment.apiUrl + '/events/';

    public activeEvents: Event[] = [];
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
        console.log(this.activeEvents);
    }

    getScript(id: string): Observable<Script> {
        return this.http.get<Script>(this.BACKEND_URL + '/script/' + id);
    }

    reset(): void {
        this.activeEvents = [];
    }

}