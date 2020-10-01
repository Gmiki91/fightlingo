import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Sentence } from './sentence.model';

@Injectable()
export class QuizService{
    

    //private sentences:Sentence[]=[];
    private sentenceListChanged=new Subject<Sentence[]>();
    private sentenceChanged=new Subject<Sentence>();

    constructor(private http: HttpClient){}

    
    getLearnableSentences(){
        this.http.get('http://localhost:3300/api/sentences/learnable')
        .subscribe((responseData:Sentence[])=>{
            this.sentenceListChanged.next(responseData);
            console.log("getLearnableSentences");
        });
    }
    getPracticeableSentences(){
        this.http.get('http://localhost:3300/api/sentences/practicable')
        .subscribe((responseData:Sentence[])=>{
            this.sentenceListChanged.next(responseData);
            return responseData!=null;
        });
    }

    getSentenceUpdateListener(){
        return this.sentenceChanged.asObservable();
    }
    getSentenceListUpdateListener(){
        return this.sentenceListChanged.asObservable();
    }

    updateSentence(sentence:Sentence, answerEfficieny:number){

        sentence.difficulty =  Math.max(1.3,  sentence.difficulty + 0.1 - (5.0 - answerEfficieny) * (0.08 + (5.0 - answerEfficieny)*0.02));

        //consecutiveCorrectAnswers
        if (answerEfficieny < 3) { //nem talált
            sentence.consecutiveCorrectAnswers= 0;
        } else {
            sentence.consecutiveCorrectAnswers+= 1;
            sentence.learningProgress++;
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
        let millisecondsInDay = 60 * 60 * 24 * 1000;
        let now = +new Date();
        sentence.nextReviewDate = new Date(now + millisecondsInDay*sentence.interval);

        // learning
        
        if(sentence.learningProgress>=5){
            sentence.learned=true;
        }
        
        //this.sentences.push(sentence);
        this.http.patch('http://localhost:3300/api/sentences',sentence)
        .subscribe((response)=>console.log(response));
       
    }
    /* for multiple sentences at once - not working
    sendUpdatedSentences(){
        this.http.patch('http://localhost:3300/api/sentences',this.sentences)
        .subscribe((response)=>console.log(response));
        this.sentences=[];    
    }

    getSentence(){
        this.http.get('http://localhost:3300/api/sentences')
        .subscribe((responeData:Sentence[])=>{
            console.log(responeData);
            responeData.sort((a,b)=> {
               return +a.nextReviewDate - +b.nextReviewDate;
            });
            console.log(responeData);
            this.sentenceChanged.next(responeData[0]);
        })
    }*/
}