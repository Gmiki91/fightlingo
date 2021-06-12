import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Publication } from '../models/publication.model';
import { Question } from '../models/question.enum';
import { environment } from 'src/environments/environment';


@Injectable()
export class PublicationService {
    private readonly BACKEND_URL = environment.apiUrl + '/publications/';

    private publications = new Subject<Publication[]>();
    private numberOfOwnPublications = new Subject<number>();
    private questions = new Subject<Question[]>();

    publications$ = this.publications.asObservable();
    numberOfPublications$ = this.numberOfOwnPublications.asObservable();
    questions$ =this.questions.asObservable();
    constructor(private http: HttpClient) { }

    getNumberOfOwnPublications() {
        this.http.get<Publication[]>(this.BACKEND_URL+'numberOfOwnPublications').subscribe(pubs => {
            this.numberOfOwnPublications.next(pubs.length);
        })
    }

    getArchivedPublications() {
        this.http.get<Publication[]>(this.BACKEND_URL+'archived').subscribe(pubs => {
            this.publications.next(pubs);
        });
    }

    getReviewedPublications() {
        this.http.get<Publication[]>(this.BACKEND_URL+'reviewed').subscribe(pubs => {
            this.publications.next(pubs);
        });
    }

    getNotReviewedPublications() {
        this.http.get<Publication[]>(this.BACKEND_URL+'notReviewed').subscribe(pubs => {
            this.publications.next(pubs);
           
        });
    }

    getPublicationById(id:string){
        return this.http.get<Publication>(this.BACKEND_URL+id);
    }

    addPublication(pub: Publication) {
        this.http.post(this.BACKEND_URL, pub).subscribe(id => {
            this.getNotReviewedPublications();
            this.getNumberOfOwnPublications();
        })
    }

    deleteOverduePublications() {
        this.http.patch(this.BACKEND_URL+'delete', null).subscribe(() => console.log("clean pubs"));
    }

    deleteUnpopularQs(pub:Publication){
        this.http.patch(this.BACKEND_URL+'deleteUnpopularQs', pub).subscribe(() => console.log("clean qs"));
    }

    pushQuestions(pubId: string) {
        this.http.get<Question[]>(this.BACKEND_URL+'getQuestions/'+ pubId).subscribe(questions => {
            this.questions.next(questions);
        })
    }


    addQuestion(question: Question) {
        this.http.post(this.BACKEND_URL+'addQuestion', question).subscribe(isPubReviewed => {
            this.pushQuestions(question.publicationId);
            if(isPubReviewed) {
                this.getNotReviewedPublications();
            }
        })
    }
    
    likeQuestion(like:number, id:string) {
        return this.http.patch(this.BACKEND_URL+'likeQuestion', {like, id}).subscribe((pubId:string)=>this.pushQuestions(pubId))
    }

    hasBeenTaught(pub:Publication) {
        this.http.patch(this.BACKEND_URL+'hasBeenTaught', pub).subscribe(()=>{
            this.getReviewedPublications();
        })
    }
}
