import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { ArenaService } from './arena/arena.service';


@Component({
  selector: 'app-dojo',
  templateUrl: './dojo.component.html',
  styleUrls: ['./dojo.component.css']
})
export class DojoComponent implements OnInit {

  user: User;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.user=this.authService.user;
  }
  cityClosed():boolean{

    return this.user.level<2;
  }
}
