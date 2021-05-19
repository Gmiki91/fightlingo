import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { Sentence } from '../models/sentence.model';
import { Progress } from '../models/progress.model';
import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.apiUrl + '/sentences/';

@Injectable()
export class QuizService {
    private overdueList = new BehaviorSubject<Sentence[]>(null);

    constructor(private http: HttpClient) {
    }

    getFightSentences() {
        return this.http.get<Sentence[]>(BACKEND_URL+'fight');
    }

    getPracticableSentences(id: string) {
        return this.http.get<Sentence[]>(BACKEND_URL+'practice/' + id);
    }

    getLearnableSentences() {
        return this.http.get<Sentence[]>(BACKEND_URL+'learn');
    }

    getOverdueSentences() {
        return this.http.get(BACKEND_URL+'overdue/')
            .pipe(map((responseData: Sentence[]) => {
                this.overdueList.next(responseData);
            }));
    }

    getOverdueList() {
        return this.overdueList.asObservable();
    }

    updateSentence(sentenceId: string, answerEfficieny: number) {
        this.http.get<Progress>(`${environment.apiUrl}/progress/` + sentenceId)
            .subscribe((progress: Progress) => {
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
                this.http.patch(`${environment.apiUrl}/sentences`, progress).toPromise();
            });
    }

    errorHandler(error: HttpErrorResponse) {
        return throwError(error.message || 'server Error');
    }
}