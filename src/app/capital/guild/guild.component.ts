import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Scroll } from 'src/app/models/scroll.model';
import Typewriter from 't-writer.js'
@Component({
  selector: 'app-guild',
  templateUrl: './guild.component.html',
  styleUrls: ['./guild.component.css']
})
export class GuildComponent implements OnInit {

  scroll$: Observable<Scroll>;
  showSignUpForm: boolean;

  constructor() {}

  ngOnInit(): void {
    if (!localStorage.getItem('userId')) {
      this.showSignUpForm = true;
    }
  }

  onNotes(): void {
  }

  startIntro(event) {
    this.showSignUpForm = false;
    const text = event.beginner ? "Háh még csak kezdő vagy! Szánalmas!" : "Még hogy nem vagy kezdő? Ne nevetess!";
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
