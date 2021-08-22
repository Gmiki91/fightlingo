import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Proficiency } from 'src/app/shared/proficiency.enum';
import { PublicationService } from 'src/app/shared/services/publication.service';

@Component({
  selector: 'app-own-pub',
  templateUrl: './own-pub.component.html',
  styleUrls: ['./own-pub.component.css']
})
export class OwnPubComponent implements OnInit {

  numberOfPublications$: Observable<number>;
  levels: string[];
  constructor(private pubService: PublicationService) { }
 

  ngOnInit(): void {
    this.levels = Object.keys(Proficiency).filter(k => isNaN(Number(k)));
    this.numberOfPublications$ = this.pubService.numberOfPublications$.pipe(map(nr => {return nr;}));
    this.pubService.getNumberOfOwnPublications();
  }


  onSubmit(form: NgForm) {
    this.pubService.addPublication({
      "level": +Proficiency[form.value.level],
      "title": form.value.title,
      "text": form.value.text,
      "numberOfQuestions" : 0
    });
  }

  

}
