import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PublicationService } from 'src/app/services/publication.service';
import { Publication } from 'src/app/models/publication.model';
import { MatRadioChange } from '@angular/material/radio';
import swal from 'sweetalert';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-all-pub',
  templateUrl: './all-pub.component.html',
  styleUrls: ['./all-pub.component.css']
})
export class AllPubComponent implements OnInit {
  radioBtnSelected: boolean;
  newQ: boolean;
  currentPub: Publication;
  pubs$: Observable<Publication[]>;
  readyToTeach$: Observable<boolean>;
  minutesUntilReady: number;
  teachButtonOn: boolean;

  constructor(private pubService: PublicationService, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.pubs$ = this.pubService.getPublications().pipe(map(pubs => {
      return pubs
    }));
   
    this.pubService.deleteOverduePublications();

    this.readyToTeach$ = this.authService.getUpdatedUser().pipe(map(user => {
      this.minutesUntilReady = (new Date().getTime() - new Date(user.lastLecture).getTime()) / 1000 / 60;
      this.minutesUntilReady = Math.round(60 - this.minutesUntilReady);
      this.teachButtonOn = this.minutesUntilReady <= 0;
      return this.minutesUntilReady <= 0 ? true : false;
    }));
  }

  onTeach(pub: Publication): void {
    this.router.navigate(['/classroom'], { state: { id: pub._id } });
  }

  onAddQuestion(pub: Publication): void {
    this.currentPub = pub;
    this.newQ = true;
  }

  onSubmitQ(event: boolean): void {
  if(event){
    this.currentPub = null;
    this.newQ = false;
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
