import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { LessonService } from 'src/app/services/lesson.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit {

  review:string;
  clickedButton: string;
  storyRecievedBack: boolean;
  currentLessonFinished:boolean;
  reviewSubscription: Subscription=Subscription.EMPTY;
  constructor(private authService: AuthService, private lessonService: LessonService,private router: Router) { }

  ngOnInit(): void {
    this.currentLessonFinished = this.authService.user.currentLessonFinished != null;
    this.subscribeToReview();

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

  subscribeToReview(){
    if(this.reviewSubscription){
      this.reviewSubscription.unsubscribe();
    }
    this.reviewSubscription = this.lessonService.getReview()
    .subscribe((review) => {
      this.review=review;
    })
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
