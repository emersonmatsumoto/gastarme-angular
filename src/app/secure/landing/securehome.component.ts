import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {UserLoginService} from "../../service/user-login.service";
import {LoggedInCallback, Callback, CognitoUtil} from "../../service/cognito.service";
import { RouteNames } from "../../service/route-names.service";
import { UserParametersService } from "../../service/user-parameters.service";
import { UserService } from "../../service/user.service";

@Component({
    selector: 'awscognito-angular2-app',
    templateUrl: './secureHome.html',
    styleUrls: ['./secureHome.css']
})
export class SecureHomeComponent implements OnInit, LoggedInCallback {
    alphabetColors = ["#5A8770", "#B2B7BB", "#6FA9AB", "#F5AF29", "#0088B9", "#F18636",
        "#D93A37", "#A6B12E", "#5C9BBC", "#F5888D", "#9A89B5", "#407887", "#9A89B5",
        "#5A8770", "#D33F33", "#A2B01F", "#F0B126", "#0087BF", "#F18636", "#0087BF",
        "#B2B7BB", "#72ACAE", "#9C8AB4", "#5A8770", "#EEB424", "#407887"
    ];
    routeName = "Component Router";
    nickname = "";
    firstLetter = "";
    background = "";
    isAdmin = false;

    constructor(public router: Router, public userLoginService: UserLoginService, public userParams: UserParametersService, private _routeNames:RouteNames, private userService: UserService, private cognitoUtil: CognitoUtil) {
        this.userLoginService.isAuthenticated(this);
        this._routeNames.name.subscribe(n => this.routeName = n);
        console.log("SecureHomeComponent: constructor");
    }

    ngOnInit() {

    }

    isLoggedIn(message: string, isLoggedIn: boolean) {
        if (!isLoggedIn) {
            this.router.navigate(['/home/login']);
        } else {
            this.userParams.getParameters(new GetProfileCallback(this));
            this.userService.isGroup(this.cognitoUtil.getCurrentUser(), "admin")
                .subscribe(
                    isGroup => this.isAdmin = isGroup,
                    err => console.log(err)
                );

        }
    }
}

export class GetProfileCallback implements Callback {

    constructor(public me: SecureHomeComponent) {

    }

    callback() {

    }

    callbackWithParam(result: any) {
        result.forEach(element => {
            if (element.Name === "nickname"){
                this.me.nickname = element.Value;
                this.me.firstLetter = element.Value[0];
                this.me.background = this.me.alphabetColors[Math.floor((element.Value.charCodeAt(0) - 65) % this.me.alphabetColors.length)];
            }

        });
    }
}