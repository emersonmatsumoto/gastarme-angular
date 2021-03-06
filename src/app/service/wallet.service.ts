import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs/Observable'
import { Wallet } from "../model/wallet.model";
import { environment } from "../../environments/environment";

@Injectable()
export class WalletService{
    constructor(private http: HttpClient){
        console.log("WalletService: constructor");
    }

    
    get(token: string, all = false): Observable<Wallet[]> {
        let param = "";
        if (all) {
            param = "?all=true";
        }
        return this.http.get<Wallet[]>(`${environment.api}/wallets${param}`, {
            headers: {
                'Authorization': token
            } 
        });
    }

    create(token: string): Observable<Wallet> {
        return this.http.post<Wallet>(`${environment.api}/wallets`, null, {
            headers: {
                'Authorization': token
            } 
        });
    }

    delete(token: string, id: string): Observable<Object> {        
        return this.http.delete(`${environment.api}/wallets/${id}`, {
            headers: {
                'Authorization': token
            }
        });
    }
}

