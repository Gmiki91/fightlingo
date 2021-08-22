import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Character } from 'src/app/shared/models/character.model';
import { Item } from 'src/app/shared/models/items/item.model';
import { Potion } from 'src/app/shared/models/items/potion.model';
import { Robe } from 'src/app/shared/models/items/robe.model';
import { Staff } from 'src/app/shared/models/items/staff.model';
import { CharacterService } from 'src/app/shared/services/character.service';
import { ItemService } from 'src/app/shared/services/item.service';

@Component({
  selector: 'app-character-details',
  templateUrl: './character-details.component.html',
  styleUrls: ['./character-details.component.scss'],
})
export class CharacterDetailsComponent implements OnInit {

  char$: Observable<Character>;
  items$: Observable<Item[]>;
  pocketweight:number;
  constructor(private charService: CharacterService, private itemService: ItemService) { }

  ngOnInit() {
    this.char$ = this.charService.character$.pipe(map(char => {
      this.items$ = this.itemService.getItems(char.items);
      this.pocketweight = this.getPocketWeight(char.pocket);
      return char;
    }));
  }

  getPocketWeight(items:Potion[]):number{
    let weight =0;
    items.forEach(item=>{
      weight+= item.weight;
    })
    return weight;
  }

  onEquipStaff(item: Staff) {
    this.charService.equipStaff(item);
  }

  onEquipRobe(item: Robe) {
    this.charService.equipRobe(item);
  }

  addToPocket(item: Item) {
      this.charService.putInPocket(item);
  }

  removeFromPocket(item: Item) {
    this.charService.removeFromPocket(item)
  }


}
