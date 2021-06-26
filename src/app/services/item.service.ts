import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Item } from "../models/items/item.model";
import { map } from "rxjs/operators"


@Injectable()
export class ItemService {
    private readonly BACKEND_URL = environment.apiUrl + '/items/';
    constructor(private http: HttpClient) { }

    getAllItems(): Observable<Item[]> {
        return this.http.get<Item[]>(this.BACKEND_URL + 'all');
    }

    getItems(items: string[]): Observable<Item[]> {
        let hashmap = new Map<string, number>();
        items.sort();
        items.forEach((item, index) => {
            if (index > 0 && item === items[index - 1]) {
                const qty = hashmap.has(item) ? hashmap.get(item) + 1 : 2;
                hashmap.set(item, qty);
            }
        });
        let params = new HttpParams();
        for (let item of items) {
            params = params.append('items', item);
        }
        return this.http.get<Item[]>(this.BACKEND_URL, { params: params }).pipe(map(items => {
            items.forEach(item => {
                if (hashmap.has(item._id)) {
                    item.qty = hashmap.get(item._id)
                } else {
                    item.qty = 1;
                }
            })
            return items;
        }))
    }


}