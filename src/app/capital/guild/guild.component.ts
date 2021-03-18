import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Language } from 'src/app/language.enum';
import { Scroll } from 'src/app/models/scroll.model';
import { AuthService } from 'src/app/services/auth.service';
import { ScrollService } from 'src/app/services/scroll.service';
import { io } from 'socket.io-client';
import swal from 'sweetalert';
import Typewriter from 't-writer.js'
import { User } from 'src/app/models/user.model';
import { OnlineUser } from 'src/app/models/online-user.model';

@Component({
  selector: 'app-guild',
  templateUrl: './guild.component.html',
  styleUrls: ['./guild.component.css']
})


export class GuildComponent implements OnInit, OnDestroy, AfterViewInit {

  enemy:OnlineUser;
  scroll$: Observable<Scroll>;
  showGym: boolean;
  isBeginner: boolean;
  notesChecked: boolean;
  socket: any;
  hasTicket: boolean;
  user: OnlineUser;
  onlineUsers: Set<OnlineUser>;
  private sub: Subscription;
  constructor(private router: Router, private scrollService: ScrollService, private authService: AuthService) { }

  ngOnInit(): void {
    this.hasTicket = localStorage.getItem('hasTicket') === 'true' ? true : false;
    this.socket = io("http://localhost:3300/");
    this.sub = this.authService.getUpdatedUser().subscribe((user: User) => {
      if (user && !user.confirmed)
        this.checkProficiency(user.language);
      if (localStorage.getItem('hasTicket')) {
        this.user = { userName: user.name, socketId: null };
        this.socket.emit("enter", user.name);
      }
    })
  }
  ngAfterViewInit(): void {
    this.socket.on("withdrawn", ()=>{
      swal("Challenge withdrawn");
    });
  
    this.socket.on("online", (adat: [OnlineUser]) => {
      if (this.user)
        this.user = { userName: this.user.userName, socketId: this.socket.id };
      this.onlineUsers = new Set(adat);
    })

    this.socket.on("challenge", (challenger: OnlineUser) => {
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
    this.socket.emit("leave", this.user);
    if (this.sub)
      this.sub.unsubscribe();
  }
  
  enterGym(enemy:OnlineUser): void {
    this.enemy=enemy;
    swal.close();
    this.socket.emit("leave", this.user);
    this.showGym = true;
  }

  leave(): void {
    this.socket.emit("leave", this.user);
    this.router.navigate(['/']);
  }

  onChallenge(challenged: OnlineUser) {
    this.socket.emit("challenge", { challenger: this.user, challenged: challenged.socketId });
    this.listenToAnswer(challenged );
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

  private listenToAnswer(enemy:OnlineUser) {
    this.socket.on("challengeAccepted",()=>{
      this.enterGym(enemy);
    });
  }
  //Intro
  private checkProficiency(language: Language) {
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

  startIntro(beginner: boolean) {
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
    this.notesChecked = true;
  }

  onTakeExam() {
    this.showGym = true;
  }

  async fightFinished() {
    this.showGym = false;
    swal("congrats");
    this.authService.levelUp().toPromise();
    await this.authService.confirmUser().toPromise();
    this.router.navigate(['/']);
  }
}
