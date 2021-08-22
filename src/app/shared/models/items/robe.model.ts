import { Item } from './item.model'
import { ItemType } from './itemType.model';

export class Robe implements Item {
    constructor(
        public pic: string,
        public name: string,
        public price: number,
        public level: number,
        public capacity: number,
        public qty: number,
        public type:ItemType) {
    }

}