import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { QuizService } from '../../quiz/quiz.service';
import { LessonService } from './lesson.service';

@Component({
  selector: 'app-level-tree',
  templateUrl: './level-tree.component.html',
  styleUrls: ['./level-tree.component.css']
})
export class LevelTreeComponent implements OnInit {

  selectedLevel:string;
  levels=[];
  lessons=[];
  userRank:number;
  showLessons:boolean;
  constructor(private quizService:QuizService, private lessonService:LessonService, private authService:AuthService) {}

  ngOnInit(): void {
    for(let i=1;i<=this.lessonService.numberOfLevels;i++) {
      this.levels.push(i);
    }
    this.levels.sort((a,b)=>{return a - b;});
  }

  onClick(lesson){
    this.quizService.lessonSelected(lesson._id);
    this.selectedLevel=null;
    this.showLessons=false;
  }
  checkLessonAvailable(itemRank){
    return this.userRank<=itemRank;
  }
  onLevelClick(level){
    this.selectedLevel="Level " + level;
    this.showLessons=true;
    this.userRank=this.authService.user.rank;
    this.lessonService.getLessons(level).subscribe((data)=>{
      data.sort((a,b)=>{return a.rank - b.rank;});
      this.lessons=data;
    })

  }
}
