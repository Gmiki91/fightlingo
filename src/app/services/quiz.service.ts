import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { Sentence } from '../models/sentence.model';
import { Progress } from '../models/progress.model';

@Injectable()
export class QuizService {
    private overdueList = new BehaviorSubject<Sentence[]>(null);
    private user: User;

    constructor(private http: HttpClient, private auth: AuthService) {
        this.auth.getUpdatedUser().subscribe((user:User)=>this.user= user);
     }

    getPracticableSentences(id: string) {
       return this.http.post<Sentence[]>('http://localhost:3300/api/sentences/' + id, this.user);
    }

    getLearnableSentences() {
        return this.http.post<Sentence[]>('http://localhost:3300/api/sentences/', this.user);  
    }

    getOverdueSentences() {
       return this.http.post('http://localhost:3300/api/sentences/overdue/', this.user)
            .pipe(map((responseData: Sentence[]) => {
                this.overdueList.next(responseData);
            }));
    }

    getOverdueList() {
        return this.overdueList.asObservable();
    }

    updateSentence(sentenceId: string, answerEfficieny: number) {
        this.http.post<Progress>('http://localhost:3300/api/progress/' + sentenceId, this.user)
            .subscribe((progress:Progress)=>{
                if (!progress.learned) {
                    if (answerEfficieny >= 3) {
                        progress.learningProgress++;
                    }
                    if (progress.learningProgress >= 5) {
                        progress.learned = true;
                    }
                }
                if (progress.learned) {
                    progress.difficulty = Math.max(1.3, progress.difficulty + 0.1 - (5.0 - answerEfficieny) * (0.08 + (5.0 - answerEfficieny) * 0.02));

                    //consecutiveCorrectAnswers
                    if (answerEfficieny < 3) { //nem talált
                        progress.consecutiveCorrectAnswers = 0;
                    } else {
                        progress.consecutiveCorrectAnswers += 1;
                    }

                    // interval
                    if (progress.consecutiveCorrectAnswers <= 1) {
                        progress.interval = 1;
                    } else if (progress.consecutiveCorrectAnswers == 2) {
                        progress.interval = 3;
                    } else {
                        progress.interval = Math.round(progress.interval * progress.difficulty);
                    }

                    // next practice 
                    if (answerEfficieny > 3) {
                        let millisecondsInDay = 60 * 60 * 24 * 1000;
                        let now = +new Date();
                        progress.nextReviewDate = new Date(now + millisecondsInDay * progress.interval);
                    }
                }
                this.http.patch('http://localhost:3300/api/sentences', progress).toPromise();
            });
    }

    errorHandler(error: HttpErrorResponse) {
        return throwError(error.message || 'server Error');
    }
}