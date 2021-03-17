import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Language } from 'src/app/language.enum';
import { Scroll } from 'src/app/models/scroll.model';
import { AuthService } from 'src/app/services/auth.service';
import { ScrollService } from 'src/app/services/scroll.service';
import {io} from 'socket.io-client';
import swal from 'sweetalert';
import Typewriter from 't-writer.js'
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-guild',
  templateUrl: './guild.component.html',
  styleUrls: ['./guild.component.css']
})
export class GuildComponent implements OnInit, OnDestroy, AfterViewInit {

  scroll$: Observable<Scroll>;
  showGym:boolean;
  isBeginner:boolean;
  notesChecked:boolean;
  socket:any;
  hasTicket:boolean;
  username:string;
  onlineUsers:Set<string>;
  private sub:Subscription;
  constructor(private router:Router,private scrollService: ScrollService, private authService: AuthService) {}

  ngOnInit(): void {
    this.hasTicket=localStorage.getItem('hasTicket')==='true'? true:false;
    this.socket=io("http://localhost:3300/");
    this.sub = this.authService.getUpdatedUser().subscribe((user:User) => {
      if(user && !user.confirmed)
          this.checkProficiency(user.language);
      if(localStorage.getItem('hasTicket')){
        this.username=user.name;
        this.socket.emit("enter",user.name);
      }
    })
  }
  ngAfterViewInit(): void {
    this.socket.on("online", (adat:[string])=>{
      this.onlineUsers=new Set(adat);
    })
    this.socket.on("challenge", challengeObject=>{
      if(challengeObject.challenged === this.username){
        swal(`You have been challenged by ${challengeObject.challenger}`);
      }
    } )
  }
  ngOnDestroy(): void {
    if(this.sub)
    this.sub.unsubscribe();
  }
  enterGym():void{
    this.showGym=true;
  }

  leave():void{
    this.socket.emit("leave", this.username);
    this.router.navigate(['/']);
  }

  onChallenge(player:string){
    this.socket.emit("challenge", {challenger:this.username, challenged:player});
    swal(`You have challenged ${player}`);
  }

  //Intro
  private checkProficiency(language:Language){
    swal(`Are you a beginner at ${language}?`, {
      buttons: {
        yes: {
          text: "Yes",
          value: true
        },
        no: {
          text: "No",
          value: false
        },
      },
    }).then(answer => this.startIntro(answer))
  }

  startIntro(beginner:boolean) {
    this.isBeginner = beginner
    const text = beginner ? "You are a beginner! Check your notes!" : "So you think you know shit? Lets do the exam then!";
    const target = document.querySelector('.tw')
    const writer = new Typewriter(target, {
      loop: false,
      typeColor: 'blue'
    })
    writer
      .type(text)
      .rest(250)
      .start()

  }
  
  onNotes(): void {
    this.scroll$ = this.scrollService.getOneScroll(1);
    this.notesChecked=true;
  }

  onTakeExam(){
    this.showGym=true;
  }

 async fightFinished(){
    this.showGym=false;
    swal("congrats");
    this.authService.levelUp().toPromise();
    await this.authService.confirmUser().toPromise();
    this.router.navigate(['/']);
  }
}
