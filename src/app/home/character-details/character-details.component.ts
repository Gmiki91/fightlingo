import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Character } from 'src/app/models/character.model';
import { Item } from 'src/app/models/items/item.model';
import { CharacterService } from 'src/app/services/character.service';

@Component({
  selector: 'app-character-details',
  templateUrl: './character-details.component.html',
  styleUrls: ['./character-details.component.scss'],
})
export class CharacterDetailsComponent implements OnInit {

  char$:Observable<Character>;
  iteamAmounts:[{item:Item, amount:number}];
  constructor(private charService:CharacterService) { }

  ngOnInit() {
   this.char$= this.charService.character$;
  }

}
