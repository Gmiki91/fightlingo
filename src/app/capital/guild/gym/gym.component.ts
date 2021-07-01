import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { Character } from 'src/app/models/character.model';
import { Item } from 'src/app/models/items/item.model';
import { Potion } from 'src/app/models/items/potion.model';
import { Staff } from 'src/app/models/items/staff.model';
import { Style } from 'src/app/models/items/style.enum';
import { OnlineUser } from 'src/app/models/online-user.model';
import { CharacterService } from 'src/app/services/character.service';

@Component({
  selector: 'app-gym',
  templateUrl: './gym.component.html',
  styleUrls: ['./gym.component.css']
})
export class GymComponent implements OnInit, AfterViewInit {

  @Output() fightFinishedEmitter: EventEmitter<boolean> = new EventEmitter();
  @Input() socket: any;
  @Input() enemy: OnlineUser;
  @Input() char: Character;
  @Input() isExam: boolean;

  selectedButton;
  readyToAttack: boolean;
  miss: boolean;
  hideQuiz: boolean = true;
  spellType: Style;
  quizType: string;
  cooldown: number = 5;
  subscription: Subscription;
  path: string;
  removableItems: Item[] = [];
  brokenStaff: Staff;
  //temporary
  count: number = 0;

  constructor(private charService: CharacterService) { }

  ngOnInit(): void {
    this.path = "../../assets/duel.png";
  }

  ngAfterViewInit(): void {
    if (this.socket && !this.isExam) {
      this.socket.on("attack", data => {
        this.takeAHit(data);
      });
      this.socket.on("win", () => {
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

  heal(poti: Potion): void {
    this.char.hitpoint += poti.hpModifier;
    const index = this.char.pocket.indexOf(poti);
    this.char.pocket.splice(index, 1);
    this.removableItems.push(poti);
    this.readyToAttack = false;
    this.nextTurn();
  }

  attack(): void {
    this.playAttackSound();
    this.path = "../../assets/fromleft.gif";
    if (this.socket && !this.isExam) {
      const pwr = this.char.equippedStaff ? this.char.equippedStaff.pwr : this.char.strength;
      const criticalHit = this.char.equippedStaff ? this.char.equippedStaff.criticalHit : -1;
      this.socket.emit("attack", { spell: this.spellType, enemy: this.enemy.socketId, pwr: pwr, ch: criticalHit });
    }
    this.readyToAttack = false;
    setTimeout(() => {
      this.path = "../../assets/duel.png";
      this.count++;
      if (this.count === 3 && (!this.socket || this.isExam))
        this.fightFinishedEmitter.emit(true);
      this.nextTurn();
    }, 1000);
  }

  private takeAHit(data): void {
    console.log(data);
    this.playAttackSound();
    this.path = "../../assets/fromright.gif";
    let damage = this.amountOfDamage(data);
    if (damage < 0) {
      //staff breaks
      this.brokenStaff = this.char.equippedStaff;
      this.char.equippedStaff = null;
    } else {
      console.log("dmg ", damage);
      this.char.hitpoint = this.char.hitpoint - damage;
    }
    setTimeout(() => {
      this.path = "../../assets/duel.png";
    }, 1000);

    if (this.char.hitpoint < 1) {
      this.socket.emit("win", { channel: this.enemy.socketId });
      this.charService.removeItems(this.removableItems);
      if (this.brokenStaff)
        this.charService.staffBroke(this.brokenStaff);
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

  private youWon(): void {
    this.charService.removeItems(this.removableItems);
    if (this.brokenStaff)
      this.charService.staffBroke(this.brokenStaff);
    this.fightFinishedEmitter.emit(true);
  }

  private amountOfDamage(data): number {
    const enemySpell = data.spell;
    const rdm = (100 - (Math.random() * 20 - 10)) / 100;
    console.log(rdm);
    const ch = data.ch > Math.random() ? 1.5 : 1;
    if (ch === 1.5) {
      console.log("critical hit!");
    }
    const pwr = data.pwr * rdm * ch;

    if (!this.spellType) {
      return 1.5 * pwr;
    };

    if (enemySpell === Style.Earth) {
      switch (this.spellType) {
        case Style.Earth:
          return pwr;
        case Style.Fire:
          return 0.5 * pwr;
        case Style.Water:
          return this.doBreak() ? -1 : 1.5 * pwr;
      }
    }
    if (enemySpell === Style.Fire) {
      switch (this.spellType) {
        case Style.Earth:
          return this.doBreak() ? -1 : 1.5 * pwr;
        case Style.Fire:
          return pwr;
        case Style.Water:
          return 0.5 * pwr;
      }
    }
    if (enemySpell === Style.Water) {
      switch (this.spellType) {
        case Style.Earth:
          return 0.5 * pwr;
        case Style.Fire:
          return this.doBreak() ? -1 : 1.5 * pwr;
        case Style.Water:
          return pwr;
      }
    }
  }

  private doBreak(): boolean {
    return Math.random() < 0.2;
  }
}
