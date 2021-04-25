import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PublicationService } from 'src/app/services/publication.service';
import { Publication } from 'src/app/models/publication.model';
import { Question } from 'src/app/models/question.enum';
import { MatRadioChange } from '@angular/material/radio';
import swal from 'sweetalert';

@Component({
  selector: 'app-all-pub',
  templateUrl: './all-pub.component.html',
  styleUrls: ['./all-pub.component.css']
})
export class AllPubComponent implements OnInit {
  radioBtnSelected: boolean;
  newQ: boolean;
  answers: string[] = [];
  questions: string[] = [];
  currentPub: Publication;
  pubs$: Observable<Publication[]>;
  questions$: Observable<Question[]>;

  constructor(private pubService: PublicationService) { }

  ngOnInit(): void {
    this.pubs$ = this.pubService.getPublications().pipe(map(pubs => { return pubs }));
    this.questions$ = this.pubService.getQuestions().pipe(map(qs => {
      this.questions = qs.map(q => {
        return q.question;
      });
      return qs;
    }));
    this.pubService.deleteOverduePublications();
  }

  onExpPanelOpen(pub: Publication): void {
    this.pubService.pushQuestions(pub._id);
  }

  onTeach(pub:Publication):void{
    this.pubService.hasBeenTaught(pub);
  }

  onAddQuestion(pub: Publication): void {
    this.currentPub = pub;
    this.newQ = true;
  }

  onAddAnswer(input: string): void {
    if (!this.answers.includes(input)) {
      this.answers.push(input);
    } else {
      console.log("that is already an answer.")
    }
  }

  onRemoveAnswer(input: string): void {
    this.answers = this.answers.filter(answer => input != answer)
  }

  onSubmitQ(question: string): void {
    if (this.questions.includes(question)) {
      swal("This question is already submitted")
    } else {
      this.pubService.addQuestion({
        "publicationId": this.currentPub._id,
        "popularity": 0,
        "question": question,
        "answers": this.answers
      });
      this.currentPub = null;
      this.newQ = false;
      this.answers = [];
    }
  }

  onRadioChange(event: MatRadioChange) {
    this.radioBtnSelected = true;
    if (event.value === "not reviewed") {
      this.pubService.pushNotReviewedPublications();
    } else if (event.value === "reviewed") {
      this.pubService.pushReviewedPublications();
    } else if (event.value === "archived") {
      this.pubService.pushArchivedPublications();
    }
  }
}
