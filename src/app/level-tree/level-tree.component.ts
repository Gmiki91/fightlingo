import { Component, OnInit } from '@angular/core';
import { Lesson } from '../quiz/lesson.enum';
import { QuizService } from '../quiz/quiz.service';

@Component({
  selector: 'app-level-tree',
  templateUrl: './level-tree.component.html',
  styleUrls: ['./level-tree.component.css']
})
export class LevelTreeComponent implements OnInit {

  images=[
    {path:'../assets/one.PNG', number:1},
    {path:'../assets/two.PNG', number:2},
    {path:'../assets/three.PNG', number:3},
    {path:'../assets/four.PNG', number:4},
    {path:'../assets/five.PNG', number:5},
    {path:'../assets/six.PNG', number:6},
    {path:'../assets/seven.PNG', number:7}
  ]
  items=[
    Lesson.BasicsI,
    Lesson.BasicsII
  ];
  constructor(private quizService:QuizService) {
   }

  ngOnInit(): void {
  }

  onClick(lesson){
    this.quizService.levelChoosen(lesson.number);
  }
}
