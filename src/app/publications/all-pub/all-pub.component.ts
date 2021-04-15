import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PublicationService } from 'src/app/services/publication.service';
import { Publication } from 'src/app/models/publication.model';
import { Question } from 'src/app/models/question.enum';
import { MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'app-all-pub',
  templateUrl: './all-pub.component.html',
  styleUrls: ['./all-pub.component.css']
})
export class AllPubComponent implements OnInit {
  pubType:string;
  currentPub: Publication;
  pubs$: Observable<Publication[]>;
  questions$: Observable<Question[]>;
  constructor(private pubService: PublicationService) { }

  ngOnInit(): void {
    this.pubs$ = this.pubService.getPublications().pipe(map(pubs => { return pubs }));
    this.questions$ = this.pubService.getQuestions().pipe(map(qs => { return qs }));
  }

  onPubClick(pub: Publication): void {
    this.currentPub = pub;
    //  this.pubService.pushQuestions(pub._id);
  }
  /*
    onAddQuestion():void{
      this.pubService.addQuestion({
        "publicationId":this.currentPub._id,
        "popularity":0,
        "question":'dummy q',
        "answers":['answer1', 'answer2', 'answer3']
      });
    }
  */

  onRadioChange(event:MatRadioChange) {
    this.pubType = event.value;
    if(event.value === "not reviewed"){
      this.pubService.pushNotReviewedPublications();
    }else if(event.value === "reviewed"){
      this.pubService.pushReviewedPublications();
    }else if(event.value === "archived"){
      this.pubService.pushArchivedPublications();
    }
  }
}
