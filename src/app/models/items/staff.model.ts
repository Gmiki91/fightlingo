import { Item } from "./item.model";
import { Rarity } from "./rarity.enum";
import { Style } from "./style.enum";

export class Staff implements Item{

    constructor(public pic: string,
         public name: string,
         public price: number,
         public equipped: boolean,
         public style:Style,
         public rarity: Rarity,
         public pwr:number,
         public broken:boolean
         ){

    }
}