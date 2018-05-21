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

    
    get(token: string): Observable<Wallet> {
        return this.http.get<Wallet>(`${environment.api}/wallets`, {
            headers: {
                'Authorization': token
            } 
        });
    }
}

