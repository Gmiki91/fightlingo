import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/auth/auth.service';
import { Sentence } from 'src/app/quiz/sentence.model';
import { Master } from '../master.model';


export class ArenaService{
    constructor(private http: HttpClient, private authService:AuthService){
    }

    getMastersByLevel(){
        return this.http.get<Master[]>("http://localhost:3300/api/masters/level/"+this.authService.user.level);
    }
    getMasterByRank(rank:number){
        return this.http.get<Master>("http://localhost:3300/api/masters/rank/"+rank);
    }

    getSentencesOfMastersLesson(masterRank:number){
        let body = {
            language:this.authService.user.language,
            rank:masterRank };
        return this.http.post<Sentence[]>("http://localhost:3300/api/sentences/speed_gauge/",body);
    }
}