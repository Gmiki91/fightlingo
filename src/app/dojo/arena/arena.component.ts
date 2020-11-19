import { Component, OnInit } from '@angular/core';
import { Master } from '../master.model';
import { first } from 'rxjs/operators';
import { ArenaService } from './arena.service';
import { AuthService } from 'src/app/auth/auth.service';
@Component({
  selector: 'app-arena',
  templateUrl: './arena.component.html',
  styleUrls: ['./arena.component.css']
})
export class ArenaComponent implements OnInit {
  masters: Master[];
  selectedMaster: Master;
  fightOn:boolean;

  constructor(private arenaService: ArenaService, private authService: AuthService) { }

  ngOnInit(): void {
    this.arenaService.getMastersByLevel().pipe(first()).subscribe(masters => {
      this.masters = masters;
      this.masters.sort((a, b) => {return b.rank-a.rank})
    });
  }

  onSelect(master: Master): void {
    this.selectedMaster = master;
    this.fightOn=true;
  }
  
  isMasterAvailable(master: Master): boolean {
    return this.authService.user.rank >= master.rank;
  }
}
