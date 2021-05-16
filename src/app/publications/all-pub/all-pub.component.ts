import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { PublicationService } from 'src/app/services/publication.service';
import { Publication } from 'src/app/models/publication.model';
import { MatRadioChange } from '@angular/material/radio';
import swal from 'sweetalert';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-all-pub',
  templateUrl: './all-pub.component.html',
  styleUrls: ['./all-pub.component.css']
})
export class AllPubComponent implements OnInit, OnDestroy {
  radioBtnSelected: number;
  newQ: boolean;
  currentPub: Publication;
  pubSub:Subscription;
  readyToTeach$: Observable<boolean>;
  minutesUntilReady: number;
  teachButtonOn: boolean;

  displayedColumns:string[];
  dataSource = new MatTableDataSource<Publication>();
  @ViewChild(MatSort, {static: false}) set content(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  constructor(private pubService: PublicationService, private router: Router, private authService: AuthService) { }
  

  ngOnInit(): void {
    /*
    this.pubs$ = this.pubService.getPublications().pipe(map(pubs => {
      this.dataSource.data = pubs;
      return pubs
    }));
   */

    this.pubSub=this.pubService.getPublications().subscribe(result=>this.dataSource.data=result);
    this.pubService.deleteOverduePublications();

    this.readyToTeach$ = this.authService.getUpdatedUser().pipe(map(user => {
      this.minutesUntilReady = (new Date().getTime() - new Date(user.lastLecture).getTime()) / 1000 / 60;
      this.minutesUntilReady = Math.round(60 - this.minutesUntilReady);
      this.teachButtonOn = this.minutesUntilReady <= 0;
      return this.minutesUntilReady <= 0 ? true : false;
    }));
  }
  ngOnDestroy(): void {
    this.pubSub?.unsubscribe();
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
  onRowClicked(pub:Publication){
    console.log(pub.title);
    if(!pub.reviewed){
      this.onAddQuestion(pub);
    }
  }

  onRadioChange(event: MatRadioChange) {
    if (event.value === "not reviewed") {
      this.radioBtnSelected = 2;
      this.displayedColumns = ["author","title", "numberOfQuestions", "dateOfPublish"];
      this.pubService.pushNotReviewedPublications();
    } else if (event.value === "reviewed") {
      this.radioBtnSelected = 3;
      this.displayedColumns = ["author","title", "numberOfQuestions", "dateOfPublish", "dateOfLastLecture"];
      this.pubService.pushReviewedPublications();
    } else if (event.value === "archived") {
      this.radioBtnSelected = 1;
      this.displayedColumns = ["author","title"];
      this.pubService.pushArchivedPublications();;
    }
  }

}
