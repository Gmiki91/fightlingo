import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Language } from 'src/app/language.enum';
import { Scroll } from 'src/app/models/scroll.model';
import { AuthService } from 'src/app/services/auth.service';
import { ScrollService } from 'src/app/services/scroll.service';
import swal from 'sweetalert';
import Typewriter from 't-writer.js'

@Component({
  selector: 'app-guild',
  templateUrl: './guild.component.html',
  styleUrls: ['./guild.component.css']
})
export class GuildComponent implements OnInit, OnDestroy {

  scroll$: Observable<Scroll>;
  showGym:boolean;
  isBeginner:boolean;
  notesChecked:boolean;

  private sub:Subscription;
  constructor(private router:Router,private scrollService: ScrollService, private authService: AuthService) {}

  ngOnInit(): void {
    this.sub = this.authService.getUpdatedUser().subscribe(user => {
      if(user && !user.confirmed)
          this.checkProficiency(user.language);
    })
  }

  ngOnDestroy(): void {
    if(this.sub)
    this.sub.unsubscribe();
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
