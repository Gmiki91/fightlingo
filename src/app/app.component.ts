import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'fightlingo';
  loggedIn = false;
  userName:string;
  monsterPic:string;

  constructor(private authService:AuthService){
    
    
  }
  ngOnInit():void{
    this.authService.getUserLoggedIn()
    .subscribe((user)=>{
      if(user){
        this.userName=user.name.toString();
        this.monsterPic='../assets/'+user.pic+'.jpg';
      }});
  }
}
