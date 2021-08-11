import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { Sentence } from '../models/sentence.model';
import { Event } from 'src/app/models/event.model';
import { EventHandler } from '../services/event-handler.service';
import { QuizService } from '../services/quiz.service';
import { Place } from '../models/place.enum';
import { Script } from '../models/script.model';
import { CharacterService } from '../services/character.service';

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
  onWorldMap: boolean;
  event: Event;
  eventId: string;
  background: string = "worldmap";

  constructor(private eventHandler: EventHandler, private quizService: QuizService, private characterService:CharacterService) { }

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
  }

  onAccept() {
    this.init();
  }

  private init() {
    this.setDistrict(this.event.place);
    document.querySelector('.tw').innerHTML = "";
    this.startQuiz = false;
    this.startEvent();
  }

  private openRequest(event: Event): void {
    this.eventHandler.getScript(event._id).pipe(first()).subscribe(script=>{
      this.script = script;
    });
  }


  private startEvent(): void {
    this.eventId = this.event._id;

    // get start text
  /*  const text = this.eventHandler.getDialogForEvent(event.id);
    const writer = new Typewriter(document.querySelector('.tw'), {
      loop: false,
      typeColor: 'blue'
    });
    writer
      .type(text)
      .rest(250)
      .start();
*/
    this.startQuiz = true;
    this.overdueSentences$ = this.quizService.getOverdueList()
      .pipe(
        map(sentences => { return sentences.slice(0, 1) }))
  }
}
