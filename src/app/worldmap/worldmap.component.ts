import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Sentence } from '../models/sentence.model';
import { Event } from 'src/app/models/event.model';
import { EventHandler } from '../services/event-handler.service';
import { QuizService } from '../services/quiz.service';
import { Place } from '../models/place.enum';
import { Script } from '../models/script.model';
import { CharacterService } from '../services/character.service';
import { ItemService } from '../services/item.service';

@Component({
  selector: 'app-worldmap',
  templateUrl: './worldmap.component.html',
  styleUrls: ['./worldmap.component.css']
})
export class WorldmapComponent implements OnInit {

  overdueSentences$: Observable<Sentence[]>;
  place: Place;
  places :Place[];
  script: Script;
  startQuiz: boolean;
  showRequest:boolean;
  onWorldMap: boolean;
  event: Event;
  background: string = "worldmap";

  constructor(
    private eventHandler: EventHandler, 
    private quizService: QuizService, 
    private characterService:CharacterService,
    private itemService:ItemService
    ) { }

  ngOnInit(): void {
    this.onWorldMap = true;
    this.places = this.characterService.availablePlaces();
  }

  showQuest(place:Place){
    for(let event of this.eventHandler.activeEvents){
      if(event.place === place){
        this.event = event;
        break;
      }
    }
    if (this.event) {
      this.openRequest(this.event);
    }else{
      this.setDistrict(place);
    }
  }

  setDistrict(place: Place) {
    this.background = place ? place : "worldmap";
    this.place=place;
    this.onWorldMap = this.place ? false : true ;
  }


  clearData() {
    this.setDistrict(null);
    this.script = null;
    this.event=null;
    this.startQuiz = false;
  }

  quizFinished(){
    const chance = this.quizService.getChanceOfRareItem();
    if(Math.random()<chance){
      console.log("Congrats, you got an item!");
      this.itemService.getRareItem().pipe(take(1)).subscribe(item=>{
        this.characterService.receiveItem(item);
      });
    };
    this.clearData();
  }

  onAccept() {
    this.showRequest = false;
    this.setDistrict(this.event.place);
    document.querySelector('.tw').innerHTML = "";
    this.startEvent();
  }

  private openRequest(event: Event): void {
    this.eventHandler.getScript(event._id).pipe(take(1)).subscribe(script=>{
      this.script = script;
      this.showRequest = true;
    });
  }


  private startEvent(): void {
    this.startQuiz = true;
    this.overdueSentences$ = this.quizService.getOverdueList()
      .pipe(
        map(sentences => { return sentences.slice(0, 1) }))
  }
}
