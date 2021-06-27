import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Character } from 'src/app/models/character.model';
import { Item } from 'src/app/models/items/item.model';
import { Potion } from 'src/app/models/items/potion.model';
import { Robe } from 'src/app/models/items/robe.model';
import { Staff } from 'src/app/models/items/staff.model';
import { CharacterService } from 'src/app/services/character.service';
import { ItemService } from 'src/app/services/item.service';

@Component({
  selector: 'app-character-details',
  templateUrl: './character-details.component.html',
  styleUrls: ['./character-details.component.scss'],
})
export class CharacterDetailsComponent implements OnInit {

  char$:Observable<Character>;
  items$:Observable<Item[]>;
  constructor(private charService:CharacterService, private itemService:ItemService) { }

  ngOnInit() {
   this.char$= this.charService.character$.pipe(map(char=>{
     this.items$=this.itemService.getItems(char.items);
     return char;
   }));
  }

  onEquipStaff(item:Staff){
      this.charService.equipStaff(item);
    
  }
  onEquipRobe(item:Robe){
    item.pocket.push()
    this.charService.equipRobe(item);
  }

}
