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
  pubs$: Observable<Publication[]>;
  constructor(private pubService: PublicationService) { }
  ngOnInit(): void {
    this.pubs$ = this.pubService.getAllPublications().pipe(map(pubs => { return pubs }));
    this.pubService.pushAllPublications();
  }

}
