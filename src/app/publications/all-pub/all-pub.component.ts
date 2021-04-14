import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PublicationService } from 'src/app/services/publication.service';
import { Publication } from 'src/app/models/publication.model';
import { Question } from 'src/app/models/question.enum';

@Component({
  selector: 'app-all-pub',
  templateUrl: './all-pub.component.html',
  styleUrls: ['./all-pub.component.css']
})
export class AllPubComponent implements OnInit {
  currentPub:Publication;
  pubs$: Observable<Publication[]>;
  questions$:Observable<Question[]>;
  constructor(private pubService: PublicationService) { }

  ngOnInit(): void {
    this.pubs$ = this.pubService.getAllPublications().pipe(map(pubs => { return pubs }));
    this.questions$ = this.pubService.getQuestions().pipe(map(qs =>{return qs}));
    this.pubService.pushAllPublications();
  }

  onPubClick(pub:Publication):void {
    this.currentPub=pub;
    this.pubService.pushQuestions(pub._id);
  }

  onAddQuestion():void{
    this.pubService.addQuestion({
      "publicationId":this.currentPub._id,
      "popularity":0,
      "question":'dummy q',
      "answers":['answer1', 'answer2', 'answer3']
    });
  }

}
