/**
 * @author Vladimir Budilov
 *
 * This is the entry-way into the routing logic. This is the first component that's called when the app
 * loads.
 *
 */
import {Component, OnInit} from "@angular/core";
import {AwsUtil} from "./service/aws.service";
import {UserLoginService} from "./service/user-login.service";
import {CognitoUtil, LoggedInCallback} from "./service/cognito.service";
import { NotificationService } from "./shared/messages/notification.service";
import { MatSnackBar } from "@angular/material";

@Component({
    selector: 'app-root',
    templateUrl: 'template/app.html'
})
export class AppComponent implements OnInit, LoggedInCallback {

    constructor(public awsUtil: AwsUtil, public userService: UserLoginService, public cognito: CognitoUtil, private notificationService: NotificationService, public snackBar: MatSnackBar) {
        console.log("AppComponent: constructor");
    }

    ngOnInit() {
        console.log("AppComponent: Checking if the user is already authenticated");
        this.userService.isAuthenticated(this);
        this.notificationService.notifier
        .do(message => {
            this.snackBar.open(message, "", {
            duration: 2000,
            });     
        }).subscribe();
    }

    isLoggedIn(message: string, isLoggedIn: boolean) {
        console.log("AppComponent: the user is authenticated: " + isLoggedIn);
        let mythis = this;
        this.cognito.getIdToken({
            callback() {

            },
            callbackWithParam(token: any) {
                // Include the passed-in callback here as well so that it's executed downstream
                console.log("AppComponent: calling initAwsService in callback")
                mythis.awsUtil.initAwsService(null, isLoggedIn, token);
            }
        });
    }
}

