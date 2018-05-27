import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserLoginService } from '../../service/user-login.service';
import { RouteNames } from '../../service/route-names.service';
import { LoggedInCallback, Callback, CognitoUtil } from '../../service/cognito.service';
import { CreditCardService } from '../../service/credit-card.service';
import { Observable } from 'rxjs/Observable';
import { CreditCard } from '../../model/credit-card.model';

@Component({
    selector: 'app-add-creditcard',
    templateUrl: './add-creditcard.component.html',
    styleUrls: ['./add-creditcard.component.css']
})
export class AddCreditCardComponent implements LoggedInCallback {
    
    description: string;
    name: string;
    cardNumber: string;
    expiryDate: string;
    cvv: number;
    limit: number;
    payday: number;

    constructor(public router: Router, public userService: UserLoginService, private routeNames: RouteNames, public creditCardService: CreditCardService, public cognitoUtil: CognitoUtil) {
        this.userService.isAuthenticated(this);
        routeNames.name.next('Adicionar Cartão');
        console.log("in CreditCardComponent");
    }

    ngOnInit() {
    }

    public add() {
        this.cognitoUtil.getIdToken(new IdTokenCallback(this));
    }

    public submit(token: string): Observable<Object> {
        console.log("submit credit card");
        let creditCard = {
            description: this.description,
            name: this.name,
            cardNumber: this.cardNumber,
            expiryDate: this.expiryDate,
            cvv: this.cvv,
            limit: this.limit,
            payday: this.payday
        };
        return this.creditCardService.add(token, creditCard);
    }

    public callback(response: Object) {
        console.log("redirect credit card");
        this.router.navigate(['/securehome/creditcard']);
    }

    isLoggedIn(message: string, isLoggedIn: boolean) {
        if (!isLoggedIn) {
            this.router.navigate(['/home/login']);
        } 
    }
}


class IdTokenCallback implements Callback {
    constructor(public addCreditCardComponent: AddCreditCardComponent) {

    }

    callback() {

    }

    callbackWithParam(result) {
        this.addCreditCardComponent.submit(result).subscribe(response => this.addCreditCardComponent.callback(response));
    }    
}