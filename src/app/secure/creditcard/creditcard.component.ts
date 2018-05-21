import { Component, OnInit, Inject } from '@angular/core';
import { RouteNames } from '../../service/route-names.service';
import { Router } from '@angular/router';
import { UserLoginService } from '../../service/user-login.service';
import { LoggedInCallback, Callback, CognitoUtil } from '../../service/cognito.service';
import { CreditCardService } from '../../service/credit-card.service';
import { CreditCard } from '../../model/credit-card.model';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'app-creditcard',
    templateUrl: './creditcard.component.html',
    styleUrls: ['./creditcard.component.css']
})
export class CreditCardComponent implements LoggedInCallback {

    public creditCards: CreditCard[]

    constructor(public router: Router, public userService: UserLoginService, private _routeNames: RouteNames, public creditCardService: CreditCardService, public cognitoUtil: CognitoUtil, public dialog: MatDialog) {
        this.userService.isAuthenticated(this);
        _routeNames.name.next('Cartões');
        console.log("in CreditCardComponent");
    }

    ngOnInit() {
    }

    isLoggedIn(message: string, isLoggedIn: boolean) {
        if (!isLoggedIn) {
            this.router.navigate(['/home/login']);
        } else {
            this.cognitoUtil.getIdToken(new ListCallback(this));            
        }
    }

    openDialog(id): void {
        let dialogRef = this.dialog.open(RemoveCreditCardDialogComponent, {
          width: '250px',
          data: { id: id }
        });
    
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            this.cognitoUtil.getIdToken(new ListCallback(this));            
        });
      }
}

class ListCallback implements Callback {
    constructor(public creditCardComponent: CreditCardComponent) { }
    callback() { }
    callbackWithParam(result) {
        this.creditCardComponent.creditCardService.list(result).subscribe(creditCards => this.creditCardComponent.creditCards = creditCards);
    }    
}


class RemoveCallback implements Callback {
    constructor(public removeComponent: RemoveCreditCardDialogComponent) { }
    callback() { }
    callbackWithParam(result) {
        this.removeComponent.removeSubmit(result).subscribe(() => this.removeComponent.removeCallback());
    }    
}


@Component({
    selector: 'remove-credit-card-dialog',
    template:  `
    <h1 mat-dialog-title>Excluir</h1>
    <mat-dialog-content>
        Deseja realmente excluir este cartão?
    </mat-dialog-content>
    <mat-dialog-actions>
        <button mat-raised-button color="warn" (click)="remove()">Excluir</button>
        <button mat-button mat-dialog-close>Cancelar</button>
    </mat-dialog-actions>
  `
  })
  export class RemoveCreditCardDialogComponent {
  
    constructor(
      public dialogRef: MatDialogRef<RemoveCreditCardDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public creditCardService: CreditCardService,
        public cognitoUtil: CognitoUtil) { }
  
    onNoClick(): void {
      this.dialogRef.close();
    }

    remove(): void {
        this.cognitoUtil.getIdToken(new RemoveCallback(this));            
    }

    removeSubmit(token): Observable<Object> {
        return this.creditCardService.remove(token, this.data.id);
    }
    
    removeCallback(): void {
        this.dialogRef.close();
    }
  
  }