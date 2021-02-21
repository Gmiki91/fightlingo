import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Language } from 'src/app/language.enum';
import { SignupForm } from 'src/app/models/signupform.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  @Output() signUpEvent:EventEmitter<SignupForm> = new EventEmitter();
  languages = [Language.FRENCH, Language.RUSSIAN, Language.SERBIAN];
  language: Language;
  imagePaths = ['szorny1',
    'szorny2',
    'szorny3',
    'szorny4'];
  imagePathIndex: number = 0;
  imagePath: string;
  beginner:boolean;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.imagePathIndex = 0;
    this.imagePath = this.imagePaths[this.imagePathIndex];
  }

  async onSignUp(form: NgForm) {
    // check for mail/userename in database for duplicates
    const signupform: SignupForm = {
      email:form.value.email, 
      password:form.value.password,
      name: form.value.fightername, 
      beginner: this.beginner,
      avatar: this.imagePath,
      language: this.language
    }
    this.signUpEvent.emit(signupform);
   //
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
    this.beginner=event.value==="true"? true : false;
  }
}
