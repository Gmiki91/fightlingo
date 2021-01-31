import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { Scroll } from 'src/app/models/scroll.model';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { ScrollService } from 'src/app/services/scroll.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit {

  buttonText: string;
  user: User;
  scrolls: Scroll[];
  selectedScroll: Scroll;
  quizType: string;

  constructor(private authService: AuthService, private ScrollService: ScrollService, private router: Router) { }

  ngOnInit(): void {
    this.authService.getUserLoggedIn().subscribe(user => {
      this.user = user;
    });
    this.authService.pushUser();
  }

  async onChooseScroll() {
    this.scrolls = await this.ScrollService.getScrolls().pipe(first()).toPromise();

  }

  onScrollClicked(scroll: Scroll): void {
    if (this.user.rank < scroll.number)
      this.buttonText = "";
    else if (this.user.rank == scroll.number)
      this.buttonText = "Translate";
    else
      this.buttonText = "Practice";

    this.selectedScroll = scroll;
  }

  onScrollBtnClicked(): void {
    if (this.buttonText === "Translate") {
      //translate(learn)
      console.log("start quiz!");
      this.quizType = "learn";
    } else {
      //flashcards
    }
  }

  quizFinished(event): void {
    console.log(event);
    if (event) {
      this.authService.updateRank();
      swal(`You've finished this scroll! Well done!`);
    }
    this.scrolls = null;
    this.selectedScroll = null;
    this.quizType = null;

  }

  onWrite(): void {
  }

  onLeave() {
    swal("Take a break?", {
      buttons: {
        yes: {
          text: "Yes!",
          value: "yes"
        },
        no: {
          text: "No!",
          value: "no",
        },
      },
    }).then((answer) => {
      if (answer == "yes") {
        this.router.navigate(['/dojo']);
      }
    })
  }




}
