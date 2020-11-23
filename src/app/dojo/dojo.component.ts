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


  ngOnInit(): void {
  }
}
