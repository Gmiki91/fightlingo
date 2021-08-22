import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Language } from 'src/app/shared/language.enum';
import { Character } from 'src/app/shared/models/character.model';
import { User } from 'src/app/shared/models/user.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CharacterService } from 'src/app/shared/services/character.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-character-selector',
  templateUrl: './character-selector.component.html',
  styleUrls: ['./character-selector.component.scss'],
})
export class CharacterSelectorComponent implements OnInit {

  user$: Observable<User>;
  charList$: Observable<Character[]>;
  createCharacterClicked: boolean;
  languages = [Language.FRENCH, Language.RUSSIAN, Language.SERBIAN];
  language: Language;
  imagePaths = ['szorny1',
    'szorny2',
    'szorny3',
    'szorny4'];
  imagePathIndex: number = 0;
  imagePath: string;

  constructor(private charService: CharacterService, private auth: AuthService) { }

  ngOnInit() {
    this.charService.getCharacters();
    this.charList$ = this.charService.characterList$;
    this.user$ = this.auth.user$;
    ;
  }

  onCreate(): void {
    this.createCharacterClicked = true;
    this.imagePathIndex = 0;
    this.imagePath = this.imagePaths[this.imagePathIndex];
  }

  onSelectChar(charId: string): void {
    this.auth.selectCurrentCharacter(charId);
  }

  onDeleteChar(charId: string): void {
    this.charService.deleteCharacter(charId);
  }

  finishCharacter(form: NgForm): void {
    let languageTaken = false;
    this.charList$.pipe(take(1)).subscribe(list => {
      for (const char of list) {
        if (char.language === this.language) {
          Swal.fire("You can only have one character per language");
          languageTaken = true;
          break;
        }
      }
      if (!languageTaken) {
        this.charService.createCharacter(form.value.characterName, this.imagePath, this.language).pipe(take(1)).subscribe(result => {
          this.auth.selectCurrentCharacter(result);
          this.createCharacterClicked = false;
        })
      }
    })
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

}
