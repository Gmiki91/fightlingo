import { Item } from "./item.model";
import { ItemType } from "./itemType.model";
import { Rarity } from "./rarity.enum";
import { Style } from "./style.enum";

export class Staff implements Item {

    constructor(
        public pic: string,
        public name: string,
        public price: number,
        public level:number,
        public pwr: number,
        public style: Style,
        public rarity: Rarity,
        public qty:number,
        public type:ItemType,
    ) {}
}
