import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Sentence } from '../models/sentence.model';
import { Event } from 'src/app/models/event.model';
import { EventHandler } from '../events/event-handler.service';
import { QuizService } from '../services/quiz.service';
import { District } from './district.enum';
import Typewriter from 't-writer.js'
import { Place } from '../models/place.enum';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css']
})
export class CityComponent implements OnInit {

  district: Place;
  overdueSentences$: Observable<Sentence[]>;
  startQuiz: boolean;
  returnAvailable: boolean;
  events: Event[] = [];
  background: string = "townmap";

  constructor(private eventHandler: EventHandler, private quizService: QuizService) { }

  ngOnInit(): void {

  }

  setDistrict(district: string) {
    switch (district) {
      case "outside":
        this.district = Place.GUILD_HALL;
        this.background = "outside";
        break;
      case "wall":
        this.district = Place.GUILD_HALL;
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

    this.init();
  }


  quizFinished(event:boolean){
    this.setDistrict(null);
  }

  private init() {
    this.returnAvailable = this.district ? true : false;
    document.querySelector('.tw').innerHTML = "";
    this.startQuiz = false;
    this.events = this.eventHandler.getActiveEvents().filter(event => { return event.place === this.district });
    if (this.events.length > 0) {
      //van event
      this.startEvent(this.events[0]);
    }
  }

  private startEvent(event: Event): void {

   // const amount = event.overdue;
    const text = this.eventHandler.getDialogForEvent(event.id);
    const writer = new Typewriter(document.querySelector('.tw'), {
      loop: false,
      typeColor: 'blue'
    });
    writer
      .type(text)
      .rest(250)
      .start();

    this.startQuiz = true;
    this.overdueSentences$ = this.quizService.getOverdueList()
      .pipe(
        map(sentences => { return sentences.slice(0, 1) }))
  }
}
