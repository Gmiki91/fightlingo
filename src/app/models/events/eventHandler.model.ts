import { District } from "src/app/city/district.enum";
import { Event } from "./event.model";

export class EventHandler{
    e0101:Event = {
        id: "e0101",
        name:"Bébi Grog",
        eventGroup: 1,
        level:1,
        overdue:0,
        maxOverdue:50,
        district:District.OUTSIDE
    };
    e0102:Event = {
        id: "e0102",
        name:"Városi patkányok",
        eventGroup: 2,
        level:1,
        overdue:0,
        maxOverdue:10,
        district:District.DOWNTOWN
    };
    e0103:Event = {
        id: "e0103",
        name:"Falevél összeszedés",
        eventGroup: 3,
        level:1,
        overdue:0,
        maxOverdue:10,
        district:District.SUBURB
    };
    e0104:Event = {
        id: "e0104",
        name:"Gazírtás",
        eventGroup: 4,
        level:1,
        overdue:0,
        maxOverdue:10,
        district:District.OUTSIDE
    };
    e0105:Event = {
        id: "e0105",
        name:"Babysit",
        eventGroup: 5,
        level:1,
        overdue:0,
        maxOverdue:10,
        district:District.PALACE
    };
    e0202:Event = {
        id: "e0202",
        name:"Kóbor kutyák",
        eventGroup: 2,
        level:2,
        overdue:0,
        maxOverdue:10,
        district:District.SUBURB
    };
    e0203:Event = {
        id: "e0203",
        name:"Macskakeresés",
        eventGroup: 3,
        level:2,
        overdue:0,
        maxOverdue:10,
        district:District.OUTSIDE
    };
    e0204:Event = {
        id: "e0204",
        name:"Ciszterna kidugítás",
        eventGroup: 4,
        level:2,
        overdue:0,
        maxOverdue:10,
        district:District.DOCKS
    };
    e0205:Event = {
        id: "e0205",
        name:"Tanácsot adni a konyhásnéninek",
        eventGroup: 5,
        level:2,
        overdue:0,
        maxOverdue:10,
        district:District.PALACE
    };

    readonly allEvents = [this.e0101,this.e0102,this.e0103,this.e0104,this.e0105, this.e0202, this.e0203, this.e0204, this.e0205];
    readonly level1Events=[this.e0101,this.e0102,this.e0103,this.e0104,this.e0105];
    readonly level2Events=[this.e0101,this.e0102,this.e0103,this.e0104,this.e0105, this.e0202, this.e0203, this.e0204, this.e0205];
    
    getEventsByLevel(level:number):Event[]{
        switch(level){
            case 1: return this.level1Events;
            case 2: return this.level2Events;
        }
    }

    getActiveEvents():Event[]{
        return this.allEvents.filter(event => event.overdue>0);
    }

}