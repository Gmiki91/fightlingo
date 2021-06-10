import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Language } from 'src/app/language.enum';
import { Scroll } from 'src/app/models/scroll.model';
import { AuthService } from 'src/app/services/auth.service';
import { ScrollService } from 'src/app/services/scroll.service';
import { io } from 'socket.io-client';
import swal from 'sweetalert';
import { User } from 'src/app/models/user.model';
import { OnlineUser } from 'src/app/models/online-user.model';
import { CharacterService } from 'src/app/services/character.service';
import { Character } from 'src/app/models/character.model';

@Component({
  selector: 'app-guild',
  templateUrl: './guild.component.html',
  styleUrls: ['./guild.component.css']
})


export class GuildComponent implements OnInit, OnDestroy, AfterViewInit {

  enemy: OnlineUser;
  showGym: boolean;
  socket: any;
  hasTicket: boolean;
  isReadyForExam:boolean;
  isExam:boolean;
  char: Character;
  onlineUser: OnlineUser;
  onlineUsers;
  private sub: Subscription;

  constructor(private router: Router, private characterService:CharacterService , private authService: AuthService) { }

  ngOnInit(): void {
    this.socket = io("http://localhost:3300/");
    this.sub = this.characterService.character$.subscribe((char: Character) => {
      if (char) {
        this.char = char;
        this.isReadyForExam = char.isReadyForExam;
        this.onlineUser = { userName: char.name, socketId: null };
        this.socket.emit("enter", char.name);
      }
    })
  }

  ngAfterViewInit(): void {
    this.socket.on("withdrawn", () => {
      swal("Challenge withdrawn");
    });

    this.socket.on("online", (adat) => {
      if (this.onlineUser)
        this.onlineUser = { userName: this.onlineUser.userName, socketId: this.socket.id };
      this.onlineUsers = Object.entries(adat);
    })

    this.socket.on("challenge", (challenger) => {
      swal(`You have been challenged by ${challenger.userName}`, {
        buttons: {
          yes: {
            text: "Accept",
            value: "yes"
          },
          no: {
            text: "Decline",
            value: "no",
          },
        },
      }).then((answer) => {
        if (answer === "yes") {
          this.socket.emit("challengeAccepted", challenger.socketId);
          this.enterGym(challenger);
        }
      });
    })

  }

  ngOnDestroy(): void {
    this.socket?.emit("leave", this.onlineUser.userName);
    this.sub?.unsubscribe();
  }
  
  takeExam():void{
   this.isExam=true;
    this.showGym=true;
  }

  leave(): void {
    this.socket.emit("leave", this.onlineUser.userName);
    this.router.navigate(['/']);
  }

  onChallenge(challengedArr: [userName: string, socketId: string]) {
    const challenged = { userName: challengedArr[0], socketId: challengedArr[1] };
    this.socket.emit("challenge", { challenger: this.onlineUser, challengedSocketId: challenged.socketId });
    this.listenToAnswer(challenged);
    swal(`You have challenged ${challenged.userName}`, {
      closeOnClickOutside: false,
      buttons: {
        withdraw: {
          text: "Withdaw challenge",
          value: "withdraw"
        }
      }
    }).then((answer) => {
      if (answer === "withdraw") {
        this.socket.emit("withdrawn", challenged.socketId);
      };
    });
  }

  private listenToAnswer(enemy: OnlineUser) {
    this.socket.on("challengeAccepted", () => {
      this.enterGym(enemy);
    });
  }

  private enterGym(enemy: OnlineUser): void {
    this.enemy = enemy;
    swal.close();
    this.socket.emit("leave", this.onlineUser.userName);
    this.showGym = true;
  }

  async fightFinished(youWon) {
    this.showGym = false;
    if (youWon){
      swal("congrats");
      if(this.isReadyForExam)
        this.characterService.levelUp().toPromise();
    }
    else
      swal("noob")
    this.router.navigate(['/']);
  }
}
