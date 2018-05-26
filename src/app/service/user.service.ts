import {Injectable} from "@angular/core";
import {Callback, CognitoUtil} from "./cognito.service";
import { Observable } from 'rxjs/Observable'
import { map  } from 'rxjs/operators'
import { CognitoUser, CognitoUserSession } from "amazon-cognito-identity-js";
import * as JWT from 'jwt-decode';

@Injectable()
export class UserService {

    constructor(public cognitoUtil: CognitoUtil) {
    }

    getDecryptedToken(cognitoUser: CognitoUser): Observable<string> {
        return Observable.bindNodeCallback(cognitoUser.getSession.bind(cognitoUser))()
            .map((session: CognitoUserSession) => session.getIdToken().getJwtToken())
            .map(token => JWT(token));
    }

    isGroup(cognitoUser: CognitoUser, group: string): Observable<boolean> {
        return this.getDecryptedToken(cognitoUser)
            .map(sessionIdInfo => sessionIdInfo['cognito:groups'].includes(group));
    }

}