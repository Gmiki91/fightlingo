import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-dojo',
  templateUrl: './dojo.component.html',
  styleUrls: ['./dojo.component.css']
})
export class DojoComponent implements OnInit {

  constructor(private authService: AuthService) { }
  ngOnInit(): void {
  }

  onMailBox(): void {
    if (this.authService.user.currentStoryLearned && !this.authService.user.currentStorySent) {
      this.authService.currentStorySent();
      console.log("story sent");

    }else if (this.authService.user.currentStorySent && !this.authService.user.currentStoryFinished) {
      let diff = (new Date().getTime()- new Date(this.authService.user.currentStorySent).getTime())/1000/3600;
      let diffInHours = Math.abs(Math.floor(diff))
      if (diffInHours > 1) {
        this.authService.currentStoryRecieved();
        console.log("story recieved back");
      }
      
    }else if (this.authService.user.currentLessonFinished && this.authService.user.currentStoryFinished) {
      let diffS = Math.abs(Math.floor((new Date().getTime() - new Date(this.authService.user.currentStoryFinished).getTime())/1000/3600));
      let diffL = Math.abs(Math.floor((new Date().getTime() - new Date(this.authService.user.currentLessonFinished).getTime())/1000/3600));
      if (diffS > 8 && diffL > 8) {
        this.authService.updateRank();
        console.log("new book recieved");
      }
    }
  }

}
