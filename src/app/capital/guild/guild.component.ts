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
  user: User;
  onlineUser: OnlineUser;
  onlineUsers;
  private sub: Subscription;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {

    this.socket = io("http://localhost:3300/");

    this.sub = this.authService.getUpdatedUser().subscribe((user: User) => {
      if (user) {
        this.user = user;
        this.onlineUser = { userName: user.name, socketId: null };
        this.socket.emit("enter", user.name);
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

    this.socket.emit("leave", this.onlineUser.userName);
    if (this.sub)
      this.sub.unsubscribe();

  }

  enterGym(enemy: OnlineUser): void {
    this.enemy = enemy;
    swal.close();
    this.socket.emit("leave", this.onlineUser.userName);
    this.showGym = true;
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

  async fightFinished(youWon) {
    this.showGym = false;
    if (youWon)
      swal("congrats");
    else
      swal("noob")
    this.router.navigate(['/']);
  }
}
