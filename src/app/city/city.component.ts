import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Sentence } from '../models/sentence.model';
import { Event } from 'src/app/models/event.model';
import { EventHandler } from '../services/event-handler.service';
import { QuizService } from '../services/quiz.service';
import { District } from './district.enum';
import Typewriter from 't-writer.js'

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css']
})
export class CityComponent implements OnInit {

  district: District;
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
        this.district = District.OUTSIDE;
        this.background = "outside";
        break;
      case "wall":
        this.district = District.WALL;
        this.background = "wall";
        break;
      case "suburb":
        this.district = District.SUBURB;
        this.background = "suburb";
        break;
      case "downtown":
        this.district = District.DOWNTOWN;
        this.background = "downtown";
        break;
      case "palace":
        this.district = District.PALACE;
        this.background = "palace";
        break;
      case "docks":
        this.district = District.DOCKS;
        this.background = "docks";
        break;
      default:
        this.district = null;
        this.background = "townmap";
    }

    this.init();
  }

  onCapital(){
    
  }

  quizFinished(event:boolean){
    this.setDistrict(null);
  }

  private init() {
    this.returnAvailable = this.district ? true : false;
    document.querySelector('.tw').innerHTML = "";
    this.startQuiz = false;
    this.events = this.eventHandler.getActiveEvents().filter(event => { return event.district === this.district });
    if (this.events.length > 0) {
      //van event
      this.startEvent(this.events[0]);
    }
  }

  private startEvent(event: Event): void {

    const amount = event.overdue;
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
        map(sentences => { return sentences.slice(0, amount) }))
  }
}
