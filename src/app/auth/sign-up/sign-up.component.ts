import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Language } from 'src/app/language.enum';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  @Output() signUpEvent:EventEmitter<{form:NgForm, beginner:boolean}> = new EventEmitter();
  languages = [Language.FRENCH, Language.RUSSIAN, Language.SERBIAN];
  language: Language;
  imagePaths = ['szorny1',
    'szorny2',
    'szorny3',
    'szorny4'];
  imagePathIndex: number = 0;
  imagePath: string;
  beginner:boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.imagePathIndex = 0;
    this.imagePath = this.imagePaths[this.imagePathIndex];
  }

  async onSignUp(form: NgForm) {
    // check for mail/userename in database for duplicates
    this.signUpEvent.emit({form:form, beginner:this.beginner});
   // await this.authService.createUser(form.value.email, form.value.password, form.value.fightername, this.imagePath, this.language).toPromise();
  }

  previousPic() {
    this.imagePathIndex--;
    if (this.imagePathIndex < 0)
      this.imagePathIndex = this.imagePaths.length - 1;
    this.imagePath = this.imagePaths[this.imagePathIndex];
  }

  nextPic() {
    this.imagePathIndex++;
    if (this.imagePathIndex > this.imagePaths.length - 1)
      this.imagePathIndex = 0
    this.imagePath = this.imagePaths[this.imagePathIndex];
  }

  isBeginner(event){
    this.beginner=event.checked;
  }
}
