import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './services/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'fightlingo';
  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    if (localStorage.getItem(environment.JWT_TOKEN))
      this.auth.refreshUser().toPromise();
  }

}
