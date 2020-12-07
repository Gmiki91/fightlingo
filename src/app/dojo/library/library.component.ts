import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit {

  storyRecievedBack:boolean;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    if(this.authService.user.currentStoryRecieved && this.authService.user.currentStoryFinished==null){
      this.storyRecievedBack=true;
    }else{
      this.storyRecievedBack=false;
    }
  }

  finishStory():void{
    this.authService.currentStoryFinished();
  }

}
