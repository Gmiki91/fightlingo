import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/auth/auth.service';
import { Master } from '../master.model';


export class ArenaService{
    constructor(private http: HttpClient, private authService:AuthService){}

    getMastersByLevel(){
        let user=this.authService.user;
        return this.http.get<Master[]>("http://localhost:3300/api/masters/"+user.level);
    }
}