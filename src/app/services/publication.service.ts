import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Publication } from '../models/publication.model';


@Injectable()
export class PublicationService {
    publications = new Subject<Publication[]>();
    constructor(private http: HttpClient) { }

    getOwnPublications() {
        return this.publications.asObservable();
    }

    addPublication(pub: Publication) {
        return this.http.post('http://localhost:3300/api/publications/', pub);
    }

    pushOwnPublications() {
        this.http.get<Publication[]>('http://localhost:3300/api/publications/').subscribe(pubs => {
            this.publications.next(pubs);
        });
    }

}
