import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { Sentence } from '../models/sentence.model';
import { Event } from 'src/app/models/event.model';
import { EventHandler } from '../services/event-handler.service';
import { QuizService } from '../services/quiz.service';
import { Place } from '../models/place.enum';
import { Script } from '../models/script.model';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css']
})
export class CityComponent implements OnInit {

  district: Place;
  overdueSentences$: Observable<Sentence[]>;
  script: Script;
  startQuiz: boolean;
  showQuestDialouge:boolean;
  returnAvailable: boolean;
  event: Event;
  eventId: string;
  background: string = "townmap";

  constructor(private eventHandler: EventHandler, private quizService: QuizService) { }

  ngOnInit(): void {
    this.returnAvailable = this.district ? true : false;
  }

  showQuest(place:Place){
    for(let event of this.eventHandler.activeEvents){
      if(event.place === place){
        this.event = event;
        break;
      }
    }
    if (this.event) {
      this.showQuestDialouge=true;
      this.openRequest(this.event);
    }
  }

  setDistrict(district: string) {
    switch (district) {
      case "outside":
        this.district = Place.GUILD_HALL;
        this.background = "outside";
        break;
      case "meadow":
        this.district = Place.MEADOW;
        this.background = "wall";
        break;
      case "suburb":
        this.district = Place.GUILD_HALL;
        this.background = "suburb";
        break;
      case "downtown":
        this.district = Place.GUILD_HALL;
        this.background = "downtown";
        break;
      case "palace":
        this.district = Place.GUILD_HALL;
        this.background = "palace";
        break;
      case "docks":
        this.district = Place.GUILD_HALL;
        this.background = "docks";
        break;
      default:
        this.district = null;
        this.background = "townmap";
    }
  }


  clearData() {
    this.setDistrict(null);
    this.showQuestDialouge = false;
    this.script = null;
    this.event=null;
  }

  onAccept() {
    this.showQuestDialouge = false;
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
