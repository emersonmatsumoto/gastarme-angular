import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserLoginService } from '../../service/user-login.service';
import { UserParametersService } from '../../service/user-parameters.service';
import { RouteNames } from '../../service/route-names.service';
import { LoggedInCallback, Callback, CognitoUtil } from '../../service/cognito.service';
import { WalletService } from '../../service/wallet.service';
import { Wallet } from '../../model/wallet.model';

@Component({
    selector: 'app-wallet',
    templateUrl: './wallet.component.html',
    styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit, LoggedInCallback {

    availableCredit = 0;
    currentBalance = 0;

    constructor(public router: Router, public userService: UserLoginService, public userParams: UserParametersService, private routeNames: RouteNames, public walletService: WalletService, private cognitoUtil: CognitoUtil) {
        this.userService.isAuthenticated(this);
        this.routeNames.name.next('Carteira');
        console.log("WalletComponent: constructor");
    }
    
    ngOnInit() {
    }
     
    setWallet(wallets: Wallet) {
        console.log("WalletComponent: setWallet");

        this.availableCredit = wallets.availableCredit;
        this.currentBalance = wallets.creditLimit - wallets.availableCredit;
    }
    
    isLoggedIn(message: string, isLoggedIn: boolean) {
        if (!isLoggedIn) {
            this.router.navigate(['/home/login']);
        } else {
            this.cognitoUtil.getIdToken(new ListCallback(this));
        }
    }
}

class ListCallback implements Callback {
    constructor(public walletComponent: WalletComponent) {

    }

    callback() {

    }

    callbackWithParam(result) {
        this.walletComponent.walletService.get(result).subscribe(wallets => this.checkWallet(result, wallets));
    }    

    checkWallet(token: string, wallets: Wallet[]) {
        if (wallets.length === 0) {
            this.walletComponent.walletService.create(token).subscribe((wallet) => this.walletComponent.setWallet(wallet));
        } else {
            this.walletComponent.setWallet(wallets[0]);
        }
        

    }
}

