import { Injectable } from "@angular/core";
import { District } from "src/app/city/district.enum";
import { Event } from "../models/event.model";

@Injectable()
export class EventHandler {
    e0101: Event = {
        id: "e0101",
        name: "Bébi Grog",
        eventGroup: 1,
        level: 1,
        overdue: 0,
        maxOverdue: 50,
        district: District.OUTSIDE,
        pollyComments: ["Baby Grog is on the loose!"]
    };
    e0102: Event = {
        id: "e0102",
        name: "Városi patkányok",
        eventGroup: 2,
        level: 1,
        overdue: 0,
        maxOverdue: 10,
        district: District.DOWNTOWN,
        pollyComments: ['I heard the town has some rat problems.']
    };
    e0103: Event = {
        id: "e0103",
        name: "Falevél összeszedés",
        eventGroup: 3,
        level: 1,
        overdue: 0,
        maxOverdue: 10,
        district: District.SUBURB,
        pollyComments: ['Leslie would like you to help her get rid of some leafs. What a noble task.']
    };
    e0104: Event = {
        id: "e0104",
        name: "Gazírtás",
        eventGroup: 4,
        level: 1,
        overdue: 0,
        maxOverdue: 10,
        district: District.OUTSIDE,
        pollyComments: ['Leslie wants you to weed out some weed!']
    };
    e0105: Event = {
        id: "e0105",
        name: "Babysit",
        eventGroup: 5,
        level: 1,
        overdue: 0,
        maxOverdue: 10,
        district: District.PALACE,
        pollyComments: ['The governor asked you to babysit his son.']
    };
    e0202: Event = {
        id: "e0202",
        name: "Kóbor kutyák",
        eventGroup: 2,
        level: 2,
        overdue: 0,
        maxOverdue: 10,
        district: District.SUBURB,
        pollyComments: ['There are wild dogs running amok in the suburbs']
    };
    e0203: Event = {
        id: "e0203",
        name: "Macskakeresés",
        eventGroup: 3,
        level: 2,
        overdue: 0,
        maxOverdue: 10,
        district: District.OUTSIDE,
        pollyComments: ['An old lady lost his cat. You should be able to locate that feline with some spell, no?']
    };
    e0204: Event = {
        id: "e0204",
        name: "Ciszterna kidugítás",
        eventGroup: 4,
        level: 2,
        overdue: 0,
        maxOverdue: 10,
        district: District.DOCKS,
        pollyComments: ['Shit has filled the docks, the sewers could do with some cleaning.']
    };
    e0205: Event = {
        id: "e0205",
        name: "Tanácsot adni a konyhásnéninek",
        eventGroup: 5,
        level: 2,
        overdue: 0,
        maxOverdue: 10,
        district: District.PALACE,
        pollyComments: ['The chef in the kitchen of the palace has run out of ideas. Help her maybe?']
    };

    readonly allEvents = [this.e0101, this.e0102, this.e0103, this.e0104, this.e0105, this.e0202, this.e0203, this.e0204, this.e0205];
    readonly level1Events = [this.e0101, this.e0102, this.e0103, this.e0104, this.e0105];
    readonly level2Events = [this.e0101, this.e0102, this.e0103, this.e0104, this.e0105, this.e0202, this.e0203, this.e0204, this.e0205];

    getEventsByLevel(level: number): Event[] {
        switch (level) {
            case 1: return this.level1Events;
            case 2: return this.level2Events;
        }
    }

    getActiveEvents(): Event[] {
        return this.allEvents.filter(event => event.overdue > 0);
    }

    getDialogForEvent(id: string): string {
        return this.allEvents.find(event => event.id == id).name
    }

    checkGrogsLocation(id: string): void {
        const event: Event = this.allEvents.find(event => event.id == id);
        if (event.overdue < 11)
            event.district = District.OUTSIDE;
        else if (event.overdue < 21)
            event.district = District.WALL;
        else if (event.overdue < 31)
            event.district = District.SUBURB;
        else if (event.overdue < 41)
            event.district = District.DOWNTOWN;
        else
            event.district = District.PALACE
    }

    reset(): void {
        this.allEvents.forEach(event => event.overdue = 0);
    }

}