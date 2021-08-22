import { ItemType } from "./itemType.model";

export interface Item {
    _id?: string,
    pic: string;
    name: string;
    price: number;
    qty: number;
    type:ItemType;
}