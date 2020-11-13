import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { Master } from '../master.model';


export class ArenaService{
    private user:User;
    constructor(private http: HttpClient, private authService:AuthService){
    }

    getMastersByLevel(){
        
        return this.http.get<Master[]>("http://localhost:3300/api/masters/level/"+this.user.level);
    }
    getMasterByRank(){
        let user=this.authService.user;
        console.log(user);
        return this.http.get<Master>("http://localhost:3300/api/masters/rank/"+user.rank);
    }
}