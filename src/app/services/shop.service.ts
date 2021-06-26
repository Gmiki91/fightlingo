import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Item } from "../models/items/item.model";

@Injectable()
export class ShopService{
    private readonly BACKEND_URL = environment.apiUrl + '/items/';
    constructor(private http:HttpClient){}

    getItems(){
        return this.http.get<Item[]>(this.BACKEND_URL);
    }
}