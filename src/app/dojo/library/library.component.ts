import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit {

  clickedButton: string;
  storyRecievedBack: boolean;
  currentLessonFinished:boolean;
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.currentLessonFinished = this.authService.user.currentLessonFinished != null;

    if (this.authService.user.currentStoryRecieved && this.authService.user.currentStoryFinished == null) {
      this.storyRecievedBack = true;
    } else {
      this.storyRecievedBack = false;
    }
  }

  onTranslate(): void {
    this.clickedButton = "translate";
  }

  onStudy(): void {
    this.clickedButton = "study";
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
        this.router.navigate(['/dojo']);
      }
    })
  }


  finishStory(): void {
    this.authService.currentStoryFinished();
  }

}
