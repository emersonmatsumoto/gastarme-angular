import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserLoginService } from '../../service/user-login.service';
import { RouteNames } from '../../service/route-names.service';
import { LoggedInCallback, Callback, CognitoUtil } from '../../service/cognito.service';
import { CreditCardService } from '../../service/credit-card.service';
import { Observable } from 'rxjs/Observable';
import { CreditCard } from '../../model/credit-card.model';
import { NotificationService } from '../../shared/messages/notification.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CreditCardValidator } from 'angular-cc-library';

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
    creditCardForm: FormGroup;
    submitted: boolean = false;

    constructor(public router: Router, public userService: UserLoginService, private routeNames: RouteNames, public creditCardService: CreditCardService, public cognitoUtil: CognitoUtil, private notificationService: NotificationService, private _fb: FormBuilder) {
        this.userService.isAuthenticated(this);
        routeNames.name.next('Adicionar Cartão');
        console.log("in CreditCardComponent");
    }

    ngOnInit() {
        this.creditCardForm = this._fb.group({
            creditCard: ['', [<any>CreditCardValidator.validateCCNumber]],
            expDate: ['', [<any>CreditCardValidator.validateExpDate]],
            cvc: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(4)]] // TODO compare actual results against card type
      });
    }

    onSubmit(creditCardForm) {
        this.submitted = true;
        console.log(creditCardForm);
        this.cognitoUtil.getIdToken(new IdTokenCallback(this, this.notificationService));
    }

    public submit(token: string): Observable<Object> {
        console.log("submit credit card");
        let creditCard = {
            description: this.description,
            name: this.name,
            cardNumber: this.cardNumber.split(' ').join(''),
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
    constructor(public addCreditCardComponent: AddCreditCardComponent, private notificationService: NotificationService) {

    }

    callback() {

    }

    callbackWithParam(result) {
        this.addCreditCardComponent.submit(result)
            .subscribe(
                response => this.addCreditCardComponent.callback(response),
                responseError => {
                    let errorObject = JSON.parse(responseError.error.errorMessage);
                    this.notificationService.notify(errorObject.errorMessage);
                }
            );
    }    
}