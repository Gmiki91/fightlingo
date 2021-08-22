import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Character } from 'src/app/shared/models/character.model';
import { Scroll } from 'src/app/shared/models/scroll.model';
import { Sentence } from 'src/app/shared/models/sentence.model';
import { User } from 'src/app/shared/models/user.model';
import { CharacterService } from 'src/app/shared/services/character.service';
import { QuizService } from 'src/app/shared/services/quiz.service';
import { ScrollService } from 'src/app/shared/services/scroll.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit, OnDestroy {

  buttonText: string;
  user: User;
  character:Character;
  scrolls: Scroll[];
  sentences$:Observable<Sentence[]>
  selectedScroll: Scroll;
  quizType: string;
  sub: Subscription;

  constructor(
    private quizService:QuizService,
    private characterService: CharacterService, 
    private scrollService: ScrollService, 
    private router: Router) { }

  ngOnInit(): void {
    this.sub = this.characterService.character$.subscribe((char:Character)=>this.character=char)
  }

  onChooseScroll() {
    this.scrollService.getScrolls().toPromise().then((result) => {
      this.scrolls = result
    })
  }

  onScrollClicked(scroll: Scroll): void {
    
    if (this.character.rank < scroll.number)
      this.buttonText = "";
    else if (this.character.rank == scroll.number && !this.character.isReadyForExam)
      this.buttonText = "Translate";
    else
      this.buttonText = "Practice";

    this.selectedScroll = scroll;
  }

  onGlossary():void{
    this.sentences$ = this.quizService.getSentencesByScrollId(this.selectedScroll._id);
  }

  onScrollBtnClicked(): void {
    if (this.buttonText === "Translate") {
      if (this.character.isReadyForExam) {
        swal("You have to take your exam first.");
      } else {
        this.readyToWork();
      }
    } else {
      this.quizType = "practice";
    }
  }

   quizFinished(event) {
    if (event) {
      this.scrollService.getOneScroll(this.character.rank + 1).toPromise().then((scroll) => {
        const nextScroll = scroll;
        const isReadyForExam = nextScroll.level > this.character.level;
        if (!isReadyForExam) {
          this.characterService.updateRank().toPromise().then(() => {
            swal(`You've finished this scroll! Well done!`);
            this.reasonForRest();
          })
        } else {
          this.characterService.readyForExam().toPromise().then(() => {
            swal(`You're ready for your next exam.`);
          });
        }
      })
    }

    this.scrolls = null;
    this.selectedScroll = null;
    this.quizType = null;
  }

  onWrite(): void {
  }

  onLeave() {
    swal("Take a break?", {
      buttons: {
        yes: {
          text: "Yes!",
          value: "yes"
        },
        no: {
          text: "No!",
          value: "no",
        },
      },
    }).then((answer) => {
      if (answer == "yes") {
        this.router.navigate(['/']);
      }
    })
  }

  ngOnDestroy(): void {
    if (this.sub)
      this.sub.unsubscribe();
  }

  private  readyToWork() {
    this.characterService.scrollFinishedAt().toPromise().then((date)=>{
      const finishedAt = new Date(date);
      const difference = 8 - (new Date().getTime() - finishedAt.getTime()) / 1000 / 60 / 60;
      if (difference < 0)
        this.quizType = "learn";
      else {
        switch (finishedAt.getSeconds() % 4) {
          case 0:
            swal(`We still need to buy some ink. The inkshop will open in about ${difference.toFixed(0)} hours`);
            break;
          case 1:
            swal(`I am still contemplating which one of my feathers should I choose as a quill. It will take at least ${difference.toFixed(0)} hours to decide.`);
            break;
          case 2:
            swal(`The guild has not yet sent us the next scrolls to translate. I think it will arrive about ${difference.toFixed(0)} hours from now.`);
            break;
          case 3:
            swal(`You want to sit in this dark room on such a beautiful day? No way! Let's go outside! I don't want to translate any more scrolls for at least ${difference.toFixed(0)} hours`);
            break;
        }
      }
    })
  }

  private reasonForRest() {
    this.characterService.scrollFinishedAt().toPromise().then((date)=>{
      const finishedAt = new Date(date);
      switch (finishedAt.getSeconds() % 4) {
        case 0:
          swal(`Oh no, we ran out of ink! We have to buy some at the ink shop, but it will only open in 8 hours. Guess we are done translating for now.`);
          break;
        case 1:
          swal(`Oh no, you broke your quill! Now I have to get you another one. I think one of my feathers will do just fine. But which one should I choose? … This might take a while to decide, 8 hours at least.`);
          break;
        case 2:
          swal(`Looks like that was all the scrolls we had. I request more from the guild, but it will take at least 8 hours for them to send new ones.`);
          break;
        case 3:
          swal(`I'm bored! We worked enough for now, let's go do something else, let's play hide and seek with ants! They are terrible at hide and seek, this should keep us occupied for at least 8 hours.`);
          break;
      }
    })
  }
}
