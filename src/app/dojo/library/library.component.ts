import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { Scroll } from 'src/app/models/scroll.model';
import { AuthService } from 'src/app/services/auth.service';
import { ScrollService } from 'src/app/services/scroll.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit {

 scrolls:Scroll[];

  constructor(private authService: AuthService, private ScrollService: ScrollService,private router: Router) { }

  ngOnInit(): void {
  }

 async onChooseScroll(){
    this.scrolls= await this.ScrollService.getScrolls().pipe(first()).toPromise();
    console.log(this.scrolls);
  }

  onScrollClicked(scrollnumber):void{

  }

  onWrite():void{

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
