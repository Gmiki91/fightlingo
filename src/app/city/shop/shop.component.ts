import { Component, OnInit } from '@angular/core';
import { ItemService } from 'src/app/services/item.service';
import { Item } from 'src/app/models/items/item.model'

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit {

  constructor(private itemService:ItemService) { }

  ngOnInit() {
    this.itemService.getItems().subscribe(items=>{
      items.forEach((item:Item)=>{
        console.log(item.name)
      })
    })
  }

}
