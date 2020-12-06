import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-dojo',
  templateUrl: './dojo.component.html',
  styleUrls: ['./dojo.component.css']
})
export class DojoComponent implements OnInit {

  o = {
    "who said that": ["Joe", "michael", "nobody"],
    "why": ["why not", "i dunno"]
  };
  ngOnInit(): void {
    console.log(this.o);
  }
}
