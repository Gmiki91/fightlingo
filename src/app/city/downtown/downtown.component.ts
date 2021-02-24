import { Component, OnInit } from '@angular/core';
import { EventHandler } from 'src/app/services/event-handler.service';
import { Event } from 'src/app/models/event.model';
import { District } from '../district.enum';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Sentence } from 'src/app/models/sentence.model';
import { QuizService } from 'src/app/services/quiz.service';
import Typewriter from 't-writer.js'

@Component({
  selector: 'app-downtown',
  templateUrl: './downtown.component.html',
  styleUrls: ['./downtown.component.css']
})
export class DowntownComponent implements OnInit {

  readonly district:District = District.DOWNTOWN;
  overdueSentences$:Observable<Sentence[]>;
  startQuiz:boolean;
  events:Event[] = [];

  constructor(private eventHandler: EventHandler, private quizService: QuizService) { }

  ngOnInit(): void {
   
    this.events = this.eventHandler.getActiveEvents().filter(event => {return event.district===this.district});
    if(this.events.length > 0) {
      //van event
      this.startEvent(this.events[0]);
    }
  }

  private startEvent(event:Event):void{

    const text = this.eventHandler.getDialogForEvent(event.id);
    const target = document.querySelector('.tw')
    const writer = new Typewriter(target, {
      loop: false,
      typeColor: 'blue'
    })
    writer
      .type(text)
      .rest(250)
      .start()


    this.startQuiz=true;
    const amount = event.overdue;
    this.overdueSentences$ = this.quizService.getOverdueList()
    .pipe(
      map(sentences=>{return sentences.slice(0,amount) }))
  }


}
