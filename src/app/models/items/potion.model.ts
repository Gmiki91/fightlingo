import { Item } from "./item.model";

export class Potion implements Item{    
    constructor(public pic:string, public name: string, public price:number){
    }
  
}