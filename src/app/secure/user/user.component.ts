import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserLoginService } from '../../service/user-login.service';
import { UserParametersService } from '../../service/user-parameters.service';
import { RouteNames } from '../../service/route-names.service';
import { CognitoUtil, Callback } from '../../service/cognito.service';
import { RegistrationUser } from '../../model/registration-user.model';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
    name: string;
    email: string;
    phone_number: string;
    password: string;

    constructor(public router: Router, public userService: UserLoginService, public userParams: UserParametersService, private routeNames: RouteNames, private cognitoUtil: CognitoUtil) {
        this.userService.isAuthenticated(this);
        this.routeNames.name.next('Conta');
        console.log("UserComponent: constructor");
    }

    ngOnInit() {

    }

    isLoggedIn(message: string, isLoggedIn: boolean) {
        if (!isLoggedIn) {
            this.router.navigate(['/home/login']);
        } else {
            this.userParams.getParameters(new GetParametersCallback(this, this.cognitoUtil));
        }
    }
}
export class GetParametersCallback implements Callback {

    constructor(public me: UserComponent, public cognitoUtil: CognitoUtil) {

    }

    callback() {

    }

    callbackWithParam(result: any) {

        console.log(JSON.stringify(result));
        for (let i = 0; i < result.length; i++) {
            if (result[i].Name == "nickname") {
                this.me.name = result[i].Value;
            } else if (result[i].Name == "phone_number") {
                this.me.phone_number == result[i].Value;
            }            
        }
        
    }
}
