import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Sentence } from './sentence.model';

@Injectable()
export class QuizService{
    

    //private sentences:Sentence[]=[];
    private sentenceListChanged=new Subject<Sentence[]>();
    private overdueListChanged=new Subject<Sentence[]>();
    //private sentenceChanged=new Subject<Sentence>();
    private levelChanged=new Subject<number>();

    constructor(private http: HttpClient){}

    levelChoosen(level:number){
        this.levelChanged.next(level);
    }

    getLevelChanged(){
        return this.levelChanged.asObservable();
    }

    getLearnableSentences(level){
        this.http.get('http://localhost:3300/api/sentences/learnable/'+level)
        .subscribe((responseData:Sentence[])=>{
            this.sentenceListChanged.next(responseData);
        });
    }
    getPracticeableSentences(level){
        this.http.get('http://localhost:3300/api/sentences/practicable/'+level)
        .subscribe((responseData:Sentence[])=>{
            
            this.sentenceListChanged.next(responseData);
          
        });
    }
    getOverdueSentences(){
        this.http.get('http://localhost:3300/api/sentences/overdue')
        .subscribe((responseData:Sentence[])=>{
            this.overdueListChanged.next(responseData);
        });
    }

   /* getSentenceUpdateListener(){
        return this.sentenceChanged.asObservable();
    }*/
    getSentenceListUpdateListener(){
        return this.sentenceListChanged.asObservable();
    }
    getOverdueListUpdateListener(){
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

            //this.sentences.push(sentence);
            this.http.patch('http://localhost:3300/api/sentences',sentence)
            .subscribe((response)=>console.log(response));
        }
       
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