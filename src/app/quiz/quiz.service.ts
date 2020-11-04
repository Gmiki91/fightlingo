import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { Sentence } from './sentence.model';
import { Progress } from './progress.model';
import { filter, mergeMap, map, toArray } from 'rxjs/operators';

@Injectable()
export class QuizService {
    

    private sentenceListChanged=new Subject<Sentence[]>();
    private overdueListChanged=new Subject<Sentence[]>();
    private levelChanged=new Subject<number>();
    private user:User;

    constructor(private http: HttpClient, private authService:AuthService){}


    levelChoosen(level:number){
        this.user=this.authService.user;
        this.levelChanged.next(level);
    }

    getLevelChanged(){
        return this.levelChanged.asObservable();
    }

    getLearnableSentences(){
        console.log("hellóservice");
        this.http.post('http://localhost:3300/api/sentences/', this.user)
        .subscribe((sentences:Sentence[])=>{
            console.log("helló subscribe");
            this.sentenceListChanged.next(sentences);
        });
        return this.sentenceListChanged.asObservable();  
        
    }
    getSentences(){
       
    }

    getPracticeableSentences(level){
        this.http.get('http://localhost:3300/api/sentences/')
        .pipe(
            mergeMap(response=>response=response[0].sentences),
           // filter((data:Sentence)=> data.learned==true && data.level==level),toArray()
        )
        .subscribe((responseData:Sentence[])=>{
            this.sentenceListChanged.next(responseData);
        });
        return this.sentenceListChanged.asObservable();
    }


    getOverdueSentences(){
        this.user=this.authService.user;
        this.http.get('http://localhost:3300/api/sentences/overdue/'+ this.user.name)
        .subscribe((responseData:Sentence[])=>{
            this.overdueListChanged.next(responseData);
        });
        return this.overdueListChanged.asObservable();
    }


    updateSentence(sentenceId:string, answerEfficieny:number){
    this.http.post<Progress>('http://localhost:3300/api/progress/'+sentenceId,this.user)
    .subscribe((progress)=>{

        if(!progress.learned){
            if (answerEfficieny >= 3){
                progress.learningProgress++;
            }
            if(progress.learningProgress>=5){
                progress.learned=true;
            }

        }else{

            progress.difficulty =  Math.max(1.3,  progress.difficulty + 0.1 - (5.0 - answerEfficieny) * (0.08 + (5.0 - answerEfficieny)*0.02));

            //consecutiveCorrectAnswers
            if (answerEfficieny < 3) { //nem talált
                progress.consecutiveCorrectAnswers= 0;
            } else {
                progress.consecutiveCorrectAnswers+= 1;
            }

            // interval
            if (progress.consecutiveCorrectAnswers<= 1) {
                progress.interval = 1;
            } else if (progress.consecutiveCorrectAnswers== 2) {
                progress.interval = 3;
            } else {
                progress.interval = Math.round(progress.interval * progress.difficulty);
            }

            // next practice 
            if(answerEfficieny > 3){
                let millisecondsInDay = 60 * 60 * 24 * 1000;
                let now = +new Date();
                progress.nextReviewDate = new Date(now + millisecondsInDay*progress.interval);
            }
        }
        this.http.patch('http://localhost:3300/api/sentences',progress)
        .subscribe((response)=>console.log(response));
    });       
    }
}