import { AfterViewInit, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import {io} from 'socket.io-client';

@Component({
  selector: 'app-gym',
  templateUrl: './gym.component.html',
  styleUrls: ['./gym.component.css']
})
export class GymComponent implements OnInit, AfterViewInit {

  @Output() fightFinishedEmitter: EventEmitter<boolean> = new EventEmitter();
  selectedButton;
  readyToAttack: boolean;
  miss: boolean;
  hideQuiz: boolean = true;
  spellType: string;
  quizType: string;
  cooldown: number = 5;
  subscription: Subscription;
  socket:any;

  //temporary
  count: number = 0;

  constructor() { }

  ngOnInit(): void {
    this.socket=io("http://localhost:3300/");
   
   }

   ngAfterViewInit(): void {
     this.socket.on("attack", adat =>{
      console.log("ajjajj", adat);
    })
   }

  spellTypeChange(event): void {

    this.selectedButton = event;
    this.spellType = event.value;
    
    this.sentenceComes();
  }

  sentenceComes(): void {
    this.hideQuiz = false;
    this.quizType = "fight";
  }

  quizResult(event: boolean): void {
    this.hideQuiz = true;
    if (event) {
      this.readyToAttack = event;
    } else {
      this.miss = true;
      const source = timer(1000, 1000);
      this.subscription = source.subscribe(() => {
        this.cooldown--;
        if (this.cooldown == 0) {
          this.nextTurn();
        }
      })
    }
  }

  attack(): void {
    this.socket.emit("attack", this.spellType);
    this.count++;
    if (this.count === 3)
      this.fightFinishedEmitter.emit(true);
    this.nextTurn();
  }

  private nextTurn(): void {
    this.quizType = null;
    this.readyToAttack = false;
    this.spellType = null;
    this.selectedButton = null;
    this.miss = false;
    this.cooldown = 5;
    if (this.subscription)
      this.subscription.unsubscribe();
  }
}
