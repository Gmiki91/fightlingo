import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Language } from '../language.enum';
import { SignupForm } from '../models/signupform.model';
import { AuthService } from '../services/auth.service';
import { CharacterService } from '../services/character.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  createCharacterClicked: boolean;
  languages = [Language.FRENCH, Language.RUSSIAN, Language.SERBIAN];
  language: Language;
  imagePaths = ['szorny1',
    'szorny2',
    'szorny3',
    'szorny4'];
  imagePathIndex: number = 0;
  imagePath: string;

  loggedIn$: Observable<boolean>;
  hasCharacter: boolean;

  sub: Subscription = Subscription.EMPTY;

  constructor(private auth: AuthService, private charService: CharacterService, private router: Router) { }


  ngOnInit(): void {
    this.loggedIn$ = this.auth.getUpdatedUser().pipe(map(user => {
      if (user) {
        this.hasCharacter = user.currentCharacter != null;
        if (this.hasCharacter) {
          this.sub = this.charService.character$.subscribe(char => {
            if (char && !char.confirmed) {
              this.router.navigate(["/intro"])
            }
          })
          this.charService.getCurrentCharacter();
        }
        return user ? true : false;
      }
    }));
  }

  onCreate(): void {
    this.createCharacterClicked = true;
    this.imagePathIndex = 0;
    this.imagePath = this.imagePaths[this.imagePathIndex];
    /*  this.charService.createCharacter().subscribe(result => {
        this.auth.selectCurrentCharacter(result);
      })*/
  }
  finishCharacter(form: NgForm): void {
    this.charService.createCharacter(form.value.characterName, this.imagePath, this.language).subscribe(result => {
      this.auth.selectCurrentCharacter(result);
    })
  }

  previousPic() {
    this.imagePathIndex--;
    if (this.imagePathIndex < 0)
      this.imagePathIndex = this.imagePaths.length - 1;
    this.imagePath = this.imagePaths[this.imagePathIndex];
  }

  nextPic() {
    this.imagePathIndex++;
    if (this.imagePathIndex > this.imagePaths.length - 1)
      this.imagePathIndex = 0
    this.imagePath = this.imagePaths[this.imagePathIndex];
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  toTheCapital(): void {
    this.router.navigate(['/guild']);
  }
  /*
    onMailBox(): void {
      if (this.authService.user.currentStoryLearned && !this.authService.user.currentStorySent) {
        this.authService.currentStorySent();
        swal("You sent your report to the guild.");
  
      }else if (this.authService.user.currentStorySent && !this.authService.user.currentStoryFinished) {
        let diff = (new Date().getTime()- new Date(this.authService.user.currentStorySent).getTime())/1000/3600;
        let diffInHours = Math.abs(Math.floor(diff))
        if (diffInHours > 1) {
          swal("The guild has sent some questions regarding your report. Go to the library to write them the answers!")
          this.authService.currentStoryRecieved();
        }
        
      }else if (this.authService.user.currentLessonFinished && this.authService.user.currentStoryFinished) {
        let diffS = Math.abs(Math.floor((new Date().getTime() - new Date(this.authService.user.currentStoryFinished).getTime())/1000/3600));
        let diffL = Math.abs(Math.floor((new Date().getTime() - new Date(this.authService.user.currentLessonFinished).getTime())/1000/3600));
        if (diffS > 8 && diffL > 8) {
          this.authService.updateRank();
          swal("The guild has approved your latest translation. You recieved a new book.")
        }
      }
    }*/
}
