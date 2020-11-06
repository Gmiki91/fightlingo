import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Language } from 'src/app/language.enum';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  languages = [Language.FRENCH,Language.RUSSIAN, Language.SERBIAN];
  language:Language;
  imagePaths= ['szorny1',
              'szorny2',
              'szorny3',
              'szorny4'];
  imagePathIndex:number=0;
  imagePath:string;

  constructor(private authService:AuthService, private router:Router) { }

  ngOnInit(): void {
    this.imagePathIndex=0;
    this.imagePath=this.imagePaths[this.imagePathIndex];
  }

  onSignUp(form:NgForm){
    this.authService.createUser(form.value.email,form.value.password, form.value.fightername, this.imagePath, this.language);
    this.router.navigate(['/']);
  }
  previousPic(){
    this.imagePathIndex--;
    if(this.imagePathIndex<0)
      this.imagePathIndex=this.imagePaths.length-1;
      this.imagePath=this.imagePaths[this.imagePathIndex];
  }
  nextPic(){
    this.imagePathIndex++;
    if(this.imagePathIndex>this.imagePaths.length-1)
      this.imagePathIndex=0
      this.imagePath=this.imagePaths[this.imagePathIndex];
  }
}
