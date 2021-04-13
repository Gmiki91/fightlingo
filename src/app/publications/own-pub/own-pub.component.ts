import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Publication } from 'src/app/models/publication.model';
import { Proficiency } from 'src/app/proficiency.enum';
import { PublicationService } from 'src/app/services/publication.service';

@Component({
  selector: 'app-own-pub',
  templateUrl: './own-pub.component.html',
  styleUrls: ['./own-pub.component.css']
})
export class OwnPubComponent implements OnInit {

  pubs:Publication[] = [];
  levels:string[];
  constructor(private pubService:PublicationService) { }

  ngOnInit(): void {
    this.levels = Object.keys(Proficiency).filter(k => isNaN(Number(k)));
    this.pubService.getOwnPublications().subscribe(((pubs:Publication[]) =>{
        this.pubs=pubs;
      }
    ));
    this.pubService.pushOwnPublications();
  }

  async onSubmit(form: NgForm) {

   const pubId = await this.pubService.addPublication({
      "level":+Proficiency[form.value.level],
      "title":form.value.title,
      "text":form.value.text
    }).toPromise();
    this.pubService.pushOwnPublications();
  }

}
