import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { Sentence } from './sentence.model';
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

    getLearnableSentences(level){
        this.http.post('http://localhost:3300/api/sentences/', this.user)
        .subscribe((sentences:Sentence[])=>{
            this.sentenceListChanged.next(sentences);
        });
        return this.sentenceListChanged.asObservable();
        
    }
    getPracticeableSentences(level){
        this.http.get('http://localhost:3300/api/sentences/'+ this.user.name)
        .pipe(
            mergeMap(response=>response=response[0].sentences),
            filter((data:Sentence)=> data.learned==true && data.level==level),toArray()
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


    updateSentence(sentence:Sentence, answerEfficieny:number){

        if(!sentence.learned){
            if (answerEfficieny >= 3){
               sentence.learningProgress++;
            }
            if(sentence.learningProgress>=5){
                sentence.learned=true;
            }

        }else{

            sentence.difficulty =  Math.max(1.3,  sentence.difficulty + 0.1 - (5.0 - answerEfficieny) * (0.08 + (5.0 - answerEfficieny)*0.02));

            //consecutiveCorrectAnswers
            if (answerEfficieny < 3) { //nem talált
                sentence.consecutiveCorrectAnswers= 0;
            } else {
                sentence.consecutiveCorrectAnswers+= 1;
            }

            // interval
            if (sentence.consecutiveCorrectAnswers<= 1) {
                sentence.interval = 1;
            } else if (sentence.consecutiveCorrectAnswers== 2) {
                sentence.interval = 3;
            } else {
                sentence.interval = Math.round(sentence.interval * sentence.difficulty);
            }

            // next practice 
            if(answerEfficieny > 3){
                let millisecondsInDay = 60 * 60 * 24 * 1000;
                let now = +new Date();
                sentence.nextReviewDate = new Date(now + millisecondsInDay*sentence.interval);
            }
        }

        //this.sentences.push(sentence);
        this.http.patch('http://localhost:3300/api/sentences',[this.user,sentence])
            .subscribe((response)=>console.log(response));
    }
}