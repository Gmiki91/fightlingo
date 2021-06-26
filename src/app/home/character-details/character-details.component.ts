import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Character } from 'src/app/models/character.model';
import { Item } from 'src/app/models/items/item.model';
import { Robe } from 'src/app/models/items/robe.model';
import { CharacterService } from 'src/app/services/character.service';

@Component({
  selector: 'app-character-details',
  templateUrl: './character-details.component.html',
  styleUrls: ['./character-details.component.scss'],
})
export class CharacterDetailsComponent implements OnInit {

  char$:Observable<Character>;
  constructor(private charService:CharacterService) { }

  ngOnInit() {
   this.char$= this.charService.character$;
  }

  onEquip(item:Item){
    const isRobe = (item as Robe).capacity != undefined;
    if(isRobe){
    this.charService.equipRobe(item);
    }else{
      this.charService.equipStaff(item)
    }
  }

}
