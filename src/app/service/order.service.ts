import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs/Observable'
import { Order } from "../model/order.model";
import { environment } from "../../environments/environment";

@Injectable()
export class OrderService{
    constructor(private http: HttpClient){
        console.log("OrderService: constructor");
    }

    list(token: string): Observable<Order[]> {        
        return this.http.get<Order[]>(`${environment.api}/orders`, {
            headers: {
                'Authorization': token
            } 
        });
    }

    create(token: string, order: Order): Observable<Object> {        
        return this.http.post(`${environment.api}/orders`, order, {
            headers: {
                'Authorization': token
            }
        });
    }

}

