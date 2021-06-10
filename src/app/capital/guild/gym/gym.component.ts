import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { Character } from 'src/app/models/character.model';
import { Style } from 'src/app/models/items/style.enum';
import { OnlineUser } from 'src/app/models/online-user.model';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-gym',
  templateUrl: './gym.component.html',
  styleUrls: ['./gym.component.css']
})
export class GymComponent implements OnInit, AfterViewInit {

  @Output() fightFinishedEmitter: EventEmitter<boolean> = new EventEmitter();
  @Input() socket: any;
  @Input() enemy: OnlineUser;
  @Input() user: Character;
  @Input() isExam:boolean;

  selectedButton;
  readyToAttack: boolean;
  miss: boolean;
  hideQuiz: boolean = true;
  spellType: Style;
  quizType: string;
  cooldown: number = 5;
  subscription: Subscription;
  path: string;
  //temporary
  count: number = 0;

  constructor() { }

  ngOnInit(): void {
    this.path = "../../assets/duel.png";
  }

  ngAfterViewInit(): void {
    if (this.socket && !this.isExam) {
      this.socket.on("attack", spell => {
        this.takeAHit(spell);
      });
      this.socket.on("win",()=>{
        this.youWon();
      })
    }
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
    this.playAttackSound();
    this.path = "../../assets/fromleft.gif";
    if (this.socket && !this.isExam){
      this.socket.emit("attack", { spell: this.spellType, enemy: this.enemy.socketId });
    }
    this.readyToAttack = false;
    setTimeout(() => {
      this.path = "../../assets/duel.png";
      this.count++;
      if ( this.count === 3 && (!this.socket || this.isExam))
        this.fightFinishedEmitter.emit(true);
      this.nextTurn();
    }, 1000);
  }

  private takeAHit(spell: string): void {
    this.playAttackSound();
    this.path = "../../assets/fromright.gif";
    let damage = this.amountOfDamage(spell);
    this.user.hitpoint = this.user.hitpoint - damage;
    setTimeout(() => {
      this.path = "../../assets/duel.png";
    }, 1000);

    if (this.user.hitpoint < 1) {
      this.socket.emit("win", {  channel: this.enemy.socketId });
      this.fightFinishedEmitter.emit(false);
    }
  };

  private nextTurn(): void {
    this.quizType = null;
   
    this.spellType = null;
    this.selectedButton = null;
    this.miss = false;
    this.cooldown = 5;
    if (this.subscription)
      this.subscription.unsubscribe();
  }

  private playAttackSound() {
    const audio = new Audio();
    audio.src = '../../assets/attack.mp3'
    audio.load();
    audio.play();
  }

  private youWon():void{
    this.fightFinishedEmitter.emit(true);
  }

  private amountOfDamage(enemySpell: string): number {
    if (!this.spellType) {
      return 4;
    };

    if (enemySpell === Style.Earth) {
      switch (this.spellType) {
        case Style.Earth:
          return 2;
        case Style.Fire:
          return 1;
        case Style.Water:
          return 3;
      }
    }
    if (enemySpell === Style.Fire) {
      switch (this.spellType) {
        case Style.Earth:
          return 1;
        case Style.Fire:
          return 2;
        case Style.Water:
          return 3;
      }
    }
    if (enemySpell === Style.Water) {
      switch (this.spellType) {
        case Style.Earth:
          return 1;
        case Style.Fire:
          return 3;
        case Style.Water:
          return 1;
      }
    }
  }
}
