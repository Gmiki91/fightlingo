import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Publication } from 'src/app/models/publication.model';
import { PublicationService } from 'src/app/services/publication.service';

@Component({
  selector: 'app-all-pub',
  templateUrl: './all-pub.component.html',
  styleUrls: ['./all-pub.component.css']
})
export class AllPubComponent implements OnInit {
  currentPub:Publication;
  pubs$: Observable<Publication[]>;
  constructor(private pubService: PublicationService) { }

  ngOnInit(): void {
    this.pubs$ = this.pubService.getAllPublications().pipe(map(pubs => { return pubs }));
    this.pubService.pushAllPublications();
  }

  onPubClick(pub:Publication):void {
    this.currentPub=pub;
    console.log(pub);
  }

  onAddQuestion():void{
  
    const question = 'dummy q';
    const answers =['answer1', 'answer2', 'answer3']
    this.pubService.addQuestion({
      "publicationId":this.currentPub._id,
      "popularity":0,
      "question":question,
      "answers":answers
    }).toPromise();
  }

}
