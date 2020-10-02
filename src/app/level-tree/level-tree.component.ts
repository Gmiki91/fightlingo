import { Component, OnInit } from '@angular/core';
import { RussianLesson } from '../quiz/language-lessons/russian-lesson.enum';
import { QuizService } from '../quiz/quiz.service';

@Component({
  selector: 'app-level-tree',
  templateUrl: './level-tree.component.html',
  styleUrls: ['./level-tree.component.css']
})
export class LevelTreeComponent implements OnInit {

  items=[
    {lesson:RussianLesson.BasicsI,number:1},
    {lesson:RussianLesson.BasicsII,number:2},
    {lesson:RussianLesson.BasicsIII,number:3},
    {lesson:RussianLesson.BasicsIII,number:3},

  ];
  constructor(private quizService:QuizService) {}

  ngOnInit(): void {
  }

  onClick(lesson){
    this.quizService.levelChoosen(lesson.number);

  }
}
