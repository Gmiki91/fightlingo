import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Publication } from '../models/publication.model';
import { Question } from '../models/question.enum';


@Injectable()
export class PublicationService {
    ownPublications = new Subject<Publication[]>();
    allPublications = new Subject<Publication[]>();
    questions = new Subject<Question[]>();
    constructor(private http: HttpClient) { }

    pushOwnPublications() {
        this.http.get<Publication[]>('http://localhost:3300/api/publications/own').subscribe(pubs => {
            this.ownPublications.next(pubs);
        });
    }

    pushAllPublications() {
        this.http.get<Publication[]>('http://localhost:3300/api/publications/all').subscribe(pubs => {
            this.allPublications.next(pubs);
        });
    }

    getOwnPublications() {
        return this.ownPublications.asObservable();
    }

    getAllPublications() {
        return this.allPublications.asObservable();
    }


    addPublication(pub: Publication) {
        this.http.post('http://localhost:3300/api/publications', pub).subscribe(id=>{
            this.pushAllPublications();
            this.pushOwnPublications();
        })
    }

    pushQuestions(pubId:string){
         this.http.get<Question[]>('http://localhost:3300/api/publications/getQuestions/' + pubId).subscribe(questions=>{
            this.questions.next(questions);
        })
    }

    getQuestions(){
        return this.questions.asObservable();
    }

    addQuestion(question: Question) {
        this.http.post('http://localhost:3300/api/publications/addQuestion', question).subscribe(id=>{
            this.pushQuestions(question.publicationId);
        })
    }

}
