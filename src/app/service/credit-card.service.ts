import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs/Observable'
import { CreditCard } from "../model/credit-card.model";
import { environment } from "../../environments/environment";

@Injectable()
export class CreditCardService{
    constructor(private http: HttpClient){
        console.log("CreditCardService: constructor");
    }

    list(token: string): Observable<CreditCard[]> {        
        return this.http.get<CreditCard[]>(`${environment.api}/creditcards`, {
            headers: {
                'Authorization': token
            } 
        });
    }

    add(token: string, creditCard: CreditCard): Observable<Object> {        
        return this.http.post(`${environment.api}/creditcards`, creditCard, {
            headers: {
                'Authorization': token
            }
        });
    }

    remove(token: string, id: string): Observable<Object> {        
        return this.http.delete(`${environment.api}/creditcards/${id}`, {
            headers: {
                'Authorization': token
            }
        });
    }
}

