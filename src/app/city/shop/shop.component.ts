import { Component, OnInit } from '@angular/core';
import { ItemService } from 'src/app/services/item.service';
import { Item } from 'src/app/models/items/item.model'
import { Observable } from 'rxjs';
import { CharacterService } from 'src/app/services/character.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit {

  items$: Observable<Item[]>
  constructor(private itemService:ItemService, private charService:CharacterService) { }

  ngOnInit() {
    this.items$=this.itemService.getAllItems();
  }

  onBuy(item:Item):void{
    console.log(item.name);
    this.charService.buy(item);
  }

}
