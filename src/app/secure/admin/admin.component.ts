import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserLoginService } from '../../service/user-login.service';
import { UserParametersService } from '../../service/user-parameters.service';
import { RouteNames } from '../../service/route-names.service';
import { WalletService } from '../../service/wallet.service';
import { CognitoUtil, Callback } from '../../service/cognito.service';
import { MatTableDataSource, MatPaginator, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Wallet } from '../../model/wallet.model';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
    displayedColumns = ['id', 'email', 'creditLimit', 'availableCredit', 'actions'];
    dataSource: MatTableDataSource<Wallet>;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }

    constructor(public router: Router, public userService: UserLoginService, public userParams: UserParametersService, private routeNames: RouteNames, public walletService: WalletService, private cognitoUtil: CognitoUtil, public dialog: MatDialog) {
        this.userService.isAuthenticated(this);
        this.routeNames.name.next('Administrativo');
        console.log("AdminComponent: constructor");
    }

    isLoggedIn(message: string, isLoggedIn: boolean) {
        if (!isLoggedIn) {
            this.router.navigate(['/home/login']);
        } else {
            this.cognitoUtil.getIdToken(new ListCallback(this));
        }
    }

    setWallets(wallets: Wallet[]) {
        this.dataSource = new MatTableDataSource(wallets);
    }

    ngOnInit() {
    }

    openDialog(id): void {
        let dialogRef = this.dialog.open(DeleteWalletComponent, {
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
    constructor(public adminComponent: AdminComponent) {

    }

    callback() {

    }

    callbackWithParam(result) {
        this.adminComponent.walletService.get(result, true).subscribe(wallets => this.adminComponent.setWallets(wallets));
    }
}




@Component({
    selector: 'remove-wallet-dialog',
    template: `
    <h1 mat-dialog-title>Excluir</h1>
    <mat-dialog-content>
        Deseja realmente excluir esta carteira?
    </mat-dialog-content>
    <mat-dialog-actions>
        <button mat-raised-button color="warn" (click)="delete()">Excluir</button>
        <button mat-button mat-dialog-close>Cancelar</button>
    </mat-dialog-actions>
  `
})
export class DeleteWalletComponent {

    constructor(
        public dialogRef: MatDialogRef<DeleteWalletComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public walletService: WalletService,
        public cognitoUtil: CognitoUtil) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

    delete(): void {
        this.cognitoUtil.getIdToken(new DeleteCallback(this));
    }

    deleteSubmit(token): Observable<Object> {
        return this.walletService.delete(token, this.data.id);
    }

    deleteCallback(): void {
        this.dialogRef.close();
    }

}

class DeleteCallback implements Callback {
    constructor(public deleteComponent: DeleteWalletComponent) { }
    callback() { }
    callbackWithParam(result) {
        this.deleteComponent.deleteSubmit(result).subscribe(() => this.deleteComponent.deleteCallback());
    }
}
