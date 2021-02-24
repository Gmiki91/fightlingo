import { Injectable } from "@angular/core";
import { District } from "../city/district.enum";

@Injectable()
export class DialogService{
private wallText = ["What a nice wall", "Someone just jumped off a wall. Maybe leave before the guards arrive?", "Nothing's happening here."];
private outsideText = ["What a nice meadow", "Did that scarecrow just moved?", "Nothing's happening here."];
private suburbText = ["Maybe you should move here!", "What nice buildings!", "Nothing's happening here."];
private downtownText = ["Very few people today. Maybe because of the weather.", "It smells like piss here", "Nothing's happening here."];
private palaceText = ["Nobody's seems to be home today.", "What a nice curtain", "Nothing's happening here."];
private docksText = ["Smells like fish", "We should buy a boat", "Nothing's happening here."];

getRandomDistrictText(district:District):string{
    switch (district) {
        case "outside":
            return this.outsideText[Math.floor(Math.random() * (this.wallText.length))];
        case "wall":
          return this.wallText[Math.floor(Math.random() * (this.wallText.length))];
        case "suburb":
            return this.suburbText[Math.floor(Math.random() * (this.wallText.length))];
        case "downtown":
            return this.downtownText[Math.floor(Math.random() * (this.wallText.length))];
        case "palace":
            return this.palaceText[Math.floor(Math.random() * (this.wallText.length))];
        case "docks":
            return this.docksText[Math.floor(Math.random() * (this.wallText.length))];
    }
}


}