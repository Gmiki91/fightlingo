import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Language } from 'src/app/language.enum';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  imagePaths= ['szorny1',
              'szorny2',
              'szorny3',
              'szorny4'];
  imagePathIndex:number=0;
  imagePath:string;
  language:Language=Language.FRENCH;

  constructor(private authService:AuthService) { }

  ngOnInit(): void {
    this.imagePathIndex=0;
    this.imagePath=this.imagePaths[this.imagePathIndex];
  }

  onSignUp(form:NgForm){
    console.log(form.value);
    this.authService.createUser(form.value.username,form.value.password, this.imagePath,this.language);
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
