import { Component, OnInit } from '@angular/core';
import { ShopService } from 'src/app/services/shop.service';
import { Item } from 'src/app/models/items/item.model'

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit {

  constructor(private shopService:ShopService) { }

  ngOnInit() {
    this.shopService.getItems().subscribe(items=>{
      items.forEach((item:Item)=>{
        console.log(item.name)
      })
    })
  }

}
