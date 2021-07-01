import { Component, OnInit } from '@angular/core';
import { ItemService } from 'src/app/services/item.service';
import { Item } from 'src/app/models/items/item.model'
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { CharacterService } from 'src/app/services/character.service';
import { Character } from 'src/app/models/character.model';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit {

  items$: Observable<Item[]>;
  charItems$ :Observable<Item[]>;
  brokens$:Observable<Item[]>;
  matter:string;
  constructor(private itemService:ItemService, private charService:CharacterService) { }

  ngOnInit() {
    this.items$=this.itemService.getAllItems();
    this.brokens$ = this.charService.character$.pipe(map((char:Character)=>{
      return char.brokens;
    }));
    this.charItems$ = this.charService.character$.pipe(switchMap((char:Character)=>{
      return this.itemService.getItems(char.items);
    }));
  }

  onRepair(item:Item){
    this.charService.repairItem(item);
  }

  onBuy(item:Item):void{
    this.charService.buyItem(item);
  }

  onSell(item:Item):void{
    this.charService.sellItem(item);

  }

  onMatterOfBusiness(matter:string){
    this.matter = matter;
    }
}
