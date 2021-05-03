import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { map } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { Publication } from 'src/app/models/publication.model';
import { Proficiency } from 'src/app/proficiency.enum';
import { PublicationService } from 'src/app/services/publication.service';
import { MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'app-own-pub',
  templateUrl: './own-pub.component.html',
  styleUrls: ['./own-pub.component.css']
})
export class OwnPubComponent implements OnInit, OnDestroy {

  radioBtnSelected: boolean;
  numberOfPublications: number;
  pubs$: Observable<Publication[]>;
  levels: string[];
  sub:Subscription;
  constructor(private pubService: PublicationService) { }
 

  ngOnInit(): void {
    this.levels = Object.keys(Proficiency).filter(k => isNaN(Number(k)));
    this.pubs$ = this.pubService.getOwnPublications().pipe(map(pubs => { return pubs }));
    this.sub= this.pubService.getNumberOfOwnPublications().subscribe(nr => {
      this.numberOfPublications = nr;
    });
    this.pubService.pushNumberOfOwnPublications();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  onSubmit(form: NgForm) {
    this.pubService.addPublication({
      "level": +Proficiency[form.value.level],
      "title": form.value.title,
      "text": form.value.text,
      "numberOfQuestions" : 0
    });
  }

  onRadioChange(event: MatRadioChange) {
    this.radioBtnSelected = true;
    if (event.value === "reviewbereit") {
      this.pubService.pushSubmittedPublications();
    } else if (event.value === "published") {
      this.pubService.pushPublishedPublications();
    }
  }

}
