import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Publication } from '../models/publication.model';
import { Question } from '../models/question.enum';
import { environment } from 'src/environments/environment';


@Injectable()
export class PublicationService {
    numberOfOwnPublications = new Subject<number>();
    ownPublications = new Subject<Publication[]>();
    publications = new Subject<Publication[]>();
    questions = new Subject<Question[]>();
    constructor(private http: HttpClient) { }

    pushNumberOfOwnPublications() {
        this.http.get<Publication[]>(`${environment.apiUrl}/publications/numberOfOwnPublications`).subscribe(pubs => {
            this.numberOfOwnPublications.next(pubs.length);
        })
    }

    pushSubmittedPublications() {
        this.http.get<Publication[]>(`${environment.apiUrl}/publications/submitted`).subscribe(pubs => {
            this.ownPublications.next(pubs);
        });
    }

    pushPublishedPublications() {
        this.http.get<Publication[]>(`${environment.apiUrl}/publications/published`).subscribe(pubs => {
            this.ownPublications.next(pubs);
        });
    }

    pushArchivedPublications() {
        this.http.get<Publication[]>(`${environment.apiUrl}/publications/archived`).subscribe(pubs => {
            this.publications.next(pubs);
        });
    }

    pushReviewedPublications() {
        this.http.get<Publication[]>(`${environment.apiUrl}/publications/reviewed`).subscribe(pubs => {
            this.publications.next(pubs);
        });
    }

    pushNotReviewedPublications() {
        this.http.get<Publication[]>(`${environment.apiUrl}/publications/notReviewed`).subscribe(pubs => {
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
        return this.http.get<Publication>(`${environment.apiUrl}/publications/`+id);
    }

    addPublication(pub: Publication) {
        this.http.post(`${environment.apiUrl}/publications`, pub).subscribe(id => {
            console.log("siker");
            this.pushNotReviewedPublications();
            this.pushSubmittedPublications();
            this.pushNumberOfOwnPublications();
        })
    }

    deleteOverduePublications() {
        this.http.patch(`${environment.apiUrl}/publications/delete`, null).subscribe(() => console.log("clean"));
    }

    pushQuestions(pubId: string) {
        this.http.get<Question[]>(`${environment.apiUrl}/publications/getQuestions/` + pubId).subscribe(questions => {
            this.questions.next(questions);
        })
    }

    getQuestions() {
        return this.questions.asObservable();
    }

    addQuestion(question: Question) {
        this.http.post(`${environment.apiUrl}/publications/addQuestion`, question).subscribe(isPubReviewed => {
            this.pushQuestions(question.publicationId);
            if(isPubReviewed) {
                this.pushNotReviewedPublications();
                this.pushSubmittedPublications();
            }
        })
    }
    
    likeQuestion(like:number, id:string) {
        return this.http.patch(`${environment.apiUrl}/publications/likeQuestion`, {like, id}).subscribe((pubId:string)=>this.pushQuestions(pubId))
    }

    hasBeenTaught(pub:Publication) {
        this.http.patch(`${environment.apiUrl}/publications/hasBeenTaught`, pub).subscribe(()=>{
            this.pushReviewedPublications();
        })
    }
}
