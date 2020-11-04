import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { QuizService } from '../quiz/quiz.service';
import { LessonService } from './lesson.service';

@Component({
  selector: 'app-level-tree',
  templateUrl: './level-tree.component.html',
  styleUrls: ['./level-tree.component.css']
})
export class LevelTreeComponent implements OnInit {

  items=[];
  userRank:number;
  constructor(private quizService:QuizService, private lessonService:LessonService, private authService:AuthService) {}

  ngOnInit(): void {
    this.userRank=this.authService.user.rank;
    this.lessonService.getLessons().subscribe((data)=>{
      data.sort((a,b)=>{return a.rank - b.rank;});
      this.items=data;
    })
  }

  onClick(lesson){
    this.quizService.levelChoosen(lesson.number);
  }
  checkLessonAvailable(itemRank){
    console.log(itemRank);
    return this.userRank+1<itemRank;
  }
}
