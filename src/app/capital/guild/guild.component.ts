import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ScrollService } from 'src/app/services/scroll.service';
import { first, map } from 'rxjs/operators';
import { User } from 'src/app/models/user.model';
import { Observable } from 'rxjs';
import { Scroll } from 'src/app/models/scroll.model';

@Component({
  selector: 'app-guild',
  templateUrl: './guild.component.html',
  styleUrls: ['./guild.component.css']
})
export class GuildComponent implements OnInit {

  scroll$:Observable<Scroll>;
  isIntro:boolean;

  constructor(private authService: AuthService, private scrollService: ScrollService) { }

  ngOnInit(): void {
    this.isIntro = this.authService.getUser()==null ? true: false;
    console.log(this.isIntro);
  }

  onNotes():void{
    
   
  }
}
