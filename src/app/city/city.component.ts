import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert';
import { first } from 'rxjs/operators'
import { Story } from '../models/story.model';
import { AuthService } from '../services/auth.service';
import { LessonService } from '../services/lesson.service';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css']
})
export class CityComponent implements OnInit {
  storyPresent: boolean;
  story: Story;

  constructor(private authService: AuthService, private lessonService: LessonService) { }

  ngOnInit(): void {
    if (!this.authService.user.currentStoryLearned) {
      swal("", "You hear a familiar tone nearby.");
      this.storyPresent = true;
    }
  }

  onInvestigate() {
    this.lessonService.getStoryByRank(this.authService.user.rank)
      .subscribe((story) => {
        this.story = story;
        this.authService.currentStoryLearned();
        console.log(story);
        this.storyPresent=false;
      })
  }
}
