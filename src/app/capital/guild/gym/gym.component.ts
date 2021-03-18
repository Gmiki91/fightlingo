import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { io } from 'socket.io-client';
import { OnlineUser } from 'src/app/models/online-user.model';

@Component({
  selector: 'app-gym',
  templateUrl: './gym.component.html',
  styleUrls: ['./gym.component.css']
})
export class GymComponent implements OnInit, AfterViewInit {

  @Output() fightFinishedEmitter: EventEmitter<boolean> = new EventEmitter();
  @Input() socket: any;
  @Input() enemy:OnlineUser;
  selectedButton;
  readyToAttack: boolean;
  miss: boolean;
  hideQuiz: boolean = true;
  spellType: string;
  quizType: string;
  cooldown: number = 5;
  subscription: Subscription;
  path:string;
  //temporary
  count: number = 0;

  constructor() { }

  ngOnInit(): void {
    this.path="../../assets/duel.png";
   // this.socket = io("http://localhost:3300/");
  }

  ngAfterViewInit(): void {
    this.socket.on("attack", spell => {
      console.log(spell);
        this.takeAHit();
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
    const audio = new Audio();
    audio.src = '../../assets/attack.mp3'
    audio.load();
    audio.play();
    this.path = "../../assets/fromleft.gif";
    this.socket.emit("attack", { spell: this.spellType, enemy:this.enemy.socketId });
    setTimeout(() => { 
      this.path="../../assets/duel.png";
      this.count++;
      if (this.count === 10)
        this.fightFinishedEmitter.emit(true);
      this.nextTurn();}, 1000);
  }

  private takeAHit(): void {
    const audio = new Audio();
    audio.src = '../../assets/attack.mp3'
    audio.load();
    audio.play();
    this.path = "../../assets/fromright.gif";

    setTimeout(() => { 
      this.path="../../assets/duel.png";
     }, 1000);
  };

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
