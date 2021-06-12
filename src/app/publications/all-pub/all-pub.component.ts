import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { PublicationService } from 'src/app/services/publication.service';
import { Publication } from 'src/app/models/publication.model';
import { MatRadioChange } from '@angular/material/radio';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { CharacterService } from 'src/app/services/character.service';

@Component({
  selector: 'app-all-pub',
  templateUrl: './all-pub.component.html',
  styleUrls: ['./all-pub.component.css']
})
export class AllPubComponent implements OnInit {
  radioBtnSelected: string;
  newQ: boolean;
  currentPub: Publication;
  readyToTeach$: Observable<boolean>;
  minutesUntilReady: number;
  teachButtonOn: boolean;
  charId:string;
  displayedColumns: string[];
  dataSource = new MatTableDataSource<Publication>();
  @ViewChild(MatSort, { static: false }) set contentSort(sort: MatSort) {
    this.dataSource.sort = sort;
  }
  @ViewChild(MatPaginator, { static: false }) set contentPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }

  constructor(private pubService: PublicationService, private router: Router, private authService: AuthService, private characterService:CharacterService) { }


  ngOnInit(): void {
    this.pubService.publications$.subscribe(result => this.dataSource.data = result);
    this.pubService.deleteOverduePublications();

    this.readyToTeach$ = this.characterService.character$.pipe(map(char => {
      this.charId= char._id;
      this.minutesUntilReady = (new Date().getTime() - new Date(char.lastLecture).getTime()) / 1000 / 60;
      this.minutesUntilReady = Math.round(60 - this.minutesUntilReady);
      this.teachButtonOn = this.minutesUntilReady <= 0;
      return this.minutesUntilReady <= 0 ? true : false;
    }));
  }

  teach(pub: Publication): void {
    this.router.navigate(['/classroom'], { state: { id: pub._id } });
  }

  addQuestion(pub: Publication): void {
    this.currentPub = pub;
    this.newQ = true;
  }

  onSubmitQ(event: boolean): void {
    if (event) {
      this.currentPub = null;
      this.newQ = false;
    }
  }

  onRowClicked(pub: Publication) {
    const button = pub.reviewed ? 'Teach' : 'Add question';
    const ownPub = pub.characterId == this.charId ? true : false;
    Swal.fire({
      title: pub.title,
      text: pub.text,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: button,
      cancelButtonText: 'Close'
    }).then((result) => {
      if (result.isConfirmed) {
        if (!pub.reviewed) {
          if (ownPub) {
            Swal.fire(
              "You can't add question to your own story"
            );
          } else {
            this.addQuestion(pub);
          }
        } else if (pub.reviewed && this.teachButtonOn) {
          this.teach(pub);
        } else if (pub.reviewed && !this.teachButtonOn) {
          Swal.fire(
            'Your previous class has just recently finished',
            `Try again in ${this.minutesUntilReady} minutes`,
            'error'
          )
        }
      }
    })
  }

  onRadioChange(event: MatRadioChange) {
    if (event.value === "not reviewed") {
      this.radioBtnSelected = "nr";
      this.displayedColumns = ["author", "title", "numberOfQuestions", "dateOfPublish"];
      this.pubService.getNotReviewedPublications();
    } else if (event.value === "reviewed") {
      this.radioBtnSelected = "r";
      this.displayedColumns = ["author", "title", "numberOfQuestions", "dateOfPublish", "dateOfLastLecture"];
      this.pubService.getReviewedPublications();
    } else if (event.value === "archived") {
      this.radioBtnSelected = "a";
      this.displayedColumns = ["author", "title"];
      this.pubService.getArchivedPublications();;
    }
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

}
