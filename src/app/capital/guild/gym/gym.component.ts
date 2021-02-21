import { Component, OnInit } from '@angular/core';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-gym',
  templateUrl: './gym.component.html',
  styleUrls: ['./gym.component.css']
})
export class GymComponent implements OnInit {
  selectedButton;
  readyToAttack:boolean;
  miss:boolean;
  spellType:string;
  quizType:string;
  cooldown:number=5;
  subscription: Subscription;

  constructor() { }

  ngOnInit(): void {}

  spellTypeChange(event):void{
    this.selectedButton=event;
    this.spellType=event.value;
    this.sentenceComes();
  }

  sentenceComes():void{
    this.quizType="fight";
  }

  quizResult(event:boolean):void{
    this.quizType=null;
    if(event){
      this.readyToAttack=event;
    }else{
      this.miss=true;
      const source = timer(1000, 1000);
      this.subscription = source.subscribe(() => {
        this.cooldown--;
        if(this.cooldown==0){
          this.nextTurn();
        }
      })
    }
  }

  attack():void{
   this.nextTurn();
  }

  private nextTurn():void{
    this.readyToAttack=false;
    this.spellType=null;
    this.selectedButton=null;
    this.miss=false;
    this.cooldown=5;
    if(this.subscription)
    this.subscription.unsubscribe();
  }
}
