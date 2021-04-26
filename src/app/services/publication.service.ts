import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Publication } from '../models/publication.model';
import { Question } from '../models/question.enum';


@Injectable()
export class PublicationService {
    numberOfOwnPublications = new Subject<number>();
    ownPublications = new Subject<Publication[]>();
    publications = new Subject<Publication[]>();
    questions = new Subject<Question[]>();
    constructor(private http: HttpClient) { }

    pushNumberOfOwnPublications() {
        this.http.get<Publication[]>('http://localhost:3300/api/publications/numberOfOwnPublications').subscribe(pubs => {
            this.numberOfOwnPublications.next(pubs.length);
        })
    }

    pushSubmittedPublications() {
        this.http.get<Publication[]>('http://localhost:3300/api/publications/submitted').subscribe(pubs => {
            this.ownPublications.next(pubs);
        });
    }

    pushPublishedPublications() {
        this.http.get<Publication[]>('http://localhost:3300/api/publications/published').subscribe(pubs => {
            this.ownPublications.next(pubs);
        });
    }

    pushArchivedPublications() {
        this.http.get<Publication[]>('http://localhost:3300/api/publications/archived').subscribe(pubs => {
            this.publications.next(pubs);
        });
    }

    pushReviewedPublications() {
        this.http.get<Publication[]>('http://localhost:3300/api/publications/reviewed').subscribe(pubs => {
            this.publications.next(pubs);
        });
    }

    pushNotReviewedPublications() {
        this.http.get<Publication[]>('http://localhost:3300/api/publications/notReviewed').subscribe(pubs => {
            this.publications.next(pubs);
           
        });
    }

    getNumberOfOwnPublications() {
        return this.numberOfOwnPublications.asObservable();
    }

    getOwnPublications() {
        return this.ownPublications.asObservable();
    }

    getPublications() {
        return this.publications.asObservable();
    }

    getPublicationById(id:string){
        return this.http.get<Publication>('http://localhost:3300/api/publications/'+id);
    }

    addPublication(pub: Publication) {
        this.http.post('http://localhost:3300/api/publications', pub).subscribe(id => {
            this.pushNotReviewedPublications();
            this.pushSubmittedPublications();
            this.pushNumberOfOwnPublications();
        })
    }

    deleteOverduePublications() {
        this.http.patch('http://localhost:3300/api/publications/delete', null).subscribe(() => console.log("clean"));
    }

    pushQuestions(pubId: string) {
        this.http.get<Question[]>('http://localhost:3300/api/publications/getQuestions/' + pubId).subscribe(questions => {
            this.questions.next(questions);
        })
    }

    getQuestions() {
        return this.questions.asObservable();
    }

    addQuestion(question: Question) {
        this.http.post('http://localhost:3300/api/publications/addQuestion', question).subscribe(isPubReviewed => {
            this.pushQuestions(question.publicationId);
            if(isPubReviewed) {
                this.pushNotReviewedPublications();
                this.pushSubmittedPublications();
            }
        })
    }
    hasBeenTaught(pub:Publication) {
        this.http.patch('http://localhost:3300/api/publications/hasBeenTaught', pub).subscribe(id=>{
            this.pushReviewedPublications();
        })
    }
}
