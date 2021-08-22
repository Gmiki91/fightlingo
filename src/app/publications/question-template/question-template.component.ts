import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Question } from 'src/app/shared/models/question.model';
import { PublicationService } from 'src/app/shared/services/publication.service';
import swal from 'sweetalert';
@Component({
  selector: 'app-question-template',
  templateUrl: './question-template.component.html',
  styleUrls: ['./question-template.component.css']
})
export class QuestionTemplateComponent implements OnInit {

  @Output() submitQuestion: EventEmitter<boolean> = new EventEmitter();
  @Input() pubId:string;
  questions$:Observable<Question[]>;
  questions: string[]=[];
  answers: string[] = [];
  constructor(private pubService:PublicationService) { }

  ngOnInit(): void {
    this.questions$ = this.pubService.questions$.pipe(map(qs => {
      this.questions = qs.map(q => {
        return q.question;
      });
      return qs;
    }));
    this.pubService.pushQuestions(this.pubId);
  }

  onRemoveAnswer(input: string): void {
    this.answers = this.answers.filter(answer => input != answer)
  }

  onAddAnswer(input: string): void {
    if (!this.answers.includes(input)) {
      this.answers.push(input);
    } else {
      console.log("that is already an answer.");
    }
  }

  onSubmitQ(question: string): void {
    if (this.questions.includes(question)) {
      swal("This question is already submitted");
    } else if (this.answers.length < 3) {
      swal("Add at least 3 answers");
    } else {
      this.pubService.addQuestion({
        "publicationId": this.pubId,
        "popularity": 0,
        "question": question,
        "answers": this.answers,
        "votedBy":[]
      });
      this.answers = [];
      this.submitQuestion.next(true);
    }
  }
}
