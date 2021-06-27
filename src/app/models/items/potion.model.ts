import { Item } from "./item.model";
import { ItemType } from "./itemType.model";

export class Potion implements Item {
    constructor(
        public pic: string,
        public name: string,
        public price: number,
        public qty: number,
        public weight: number,
        public type: ItemType) {
    }

}