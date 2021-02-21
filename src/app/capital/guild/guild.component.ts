import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Scroll } from 'src/app/models/scroll.model';
import { SignupForm } from 'src/app/models/signupform.model';
import { AuthService } from 'src/app/services/auth.service';
import { ScrollService } from 'src/app/services/scroll.service';
import Typewriter from 't-writer.js'
@Component({
  selector: 'app-guild',
  templateUrl: './guild.component.html',
  styleUrls: ['./guild.component.css']
})
export class GuildComponent implements OnInit {

  scroll$: Observable<Scroll>;
  showSignUpForm: boolean;
  isBeginner:boolean;
  notesChecked:boolean;

  private signupForm:SignupForm;

  constructor(private router:Router,private scrollService: ScrollService, private authService: AuthService) {}

  ngOnInit(): void {
    if (!localStorage.getItem('userId')) {
      this.showSignUpForm = true;
    }
  }

  onNotes(): void {
    this.scroll$ = this.scrollService.getFirstScroll(1,this.signupForm.language);
    this.notesChecked=true;
  }

  async onTakeExam(){
    console.log("exam taken!");
    await this.authService.createUser(this.signupForm).toPromise();
    this.router.navigate(['/']);
  }

  startIntro(event:SignupForm) {
    this.signupForm=event;
    this.showSignUpForm = false;
    this.isBeginner = event.beginner;
    const text = event.beginner ? "You are a beginner! Check your notes!" : "So you think you know shit? Lets do the exam then!";
    const target = document.querySelector('.tw')
    const writer = new Typewriter(target, {
      loop: false,
      typeColor: 'blue'
    })

    writer
      .type(text)
      .rest(250)
      .start()

  }
}
