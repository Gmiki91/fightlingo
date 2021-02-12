import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
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
export class LibraryComponent implements OnInit, OnDestroy {

  buttonText: string;
  user: User;
  scrolls: Scroll[];
  selectedScroll: Scroll;
  quizType: string;
  sub:Subscription;

  constructor(private auth: AuthService, private scrollService: ScrollService, private router: Router) {
   
   }
  
  ngOnInit(): void {
   this.sub = this.auth.getUpdatedUser().subscribe((user:User)=>this.user = user);
  }

  async onChooseScroll() {
    this.scrolls = await this.scrollService.getScrolls().toPromise();

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
      this.quizType = "learn";
    } else {
      this.quizType="practice";
    }
  }

 async quizFinished(event) {
    if (event) {
      await this.auth.updateRank().toPromise();
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

  ngOnDestroy(): void {
    if(this.sub)
    this.sub.unsubscribe();
  }


}
