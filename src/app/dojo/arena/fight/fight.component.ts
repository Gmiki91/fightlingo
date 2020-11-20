import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import swal from 'sweetalert';
import { Master } from '../../master.model';
import { ArenaService } from '../arena.service';

@Component({
  selector: 'app-fight',
  templateUrl: './fight.component.html',
  styleUrls: ['./fight.component.css']
})
export class FightComponent implements OnInit {

  @Input() master: Master;

  constructor(private authService: AuthService, private arenaService: ArenaService, private router: Router) { }

  ngOnInit(): void {
    console.log(this.master);
    this.youwon();
  }

  youwon(): void {
    let currentRank = this.authService.user.rank;
    swal(`You beat ${this.master.name}!`).then(async () => {
      if (currentRank == this.master.rank) {
        if (this.master.gm) {
          this.authService.levelUp();
          swal(`You beat level ${currentRank}! Well done!`)
            .then(() => swal(`Grandmaster ${this.master.name} has invited you to teach in his prestigious dojo. Head to the city to check it out!`));
        } else {
          this.authService.updateRank();

          let nextMaster = await this.arenaService.getMasterByRank(this.authService.user.rank + 1).pipe(first()).toPromise();
          if (nextMaster) { //current rank is an even number, +1 makes it odd, only gm-s have odd ranks
            swal(`You are now ready to face ${nextMaster.name}`);
          } else {
            swal(`A new lesson has opened up.`);
          }
        }
      }
      this.router.navigate(['/dojo']);
    })
  }
}
