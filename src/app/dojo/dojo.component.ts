import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dojo',
  templateUrl: './dojo.component.html',
  styleUrls: ['./dojo.component.css']
})
export class DojoComponent implements OnInit {
  
  loggedIn$: Observable<boolean>;

  constructor(private auth: AuthService) {  }
  
  ngOnInit(): void {
    this.loggedIn$= this.auth.getUpdatedUser().pipe(map(user=>{return user ? true:false;}))

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
