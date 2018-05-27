import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserLoginService } from '../../service/user-login.service';
import { UserParametersService } from '../../service/user-parameters.service';
import { RouteNames } from '../../service/route-names.service';
import { CognitoUtil, Callback } from '../../service/cognito.service';
import { OrderService } from '../../service/order.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatTableDataSource, MatPaginator } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Order } from '../../model/order.model';

@Component({
    selector: 'app-order',
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
    displayedColumns = ['date', 'description', 'creditCardDescription', 'total'];
    dataSource = new MatTableDataSource<Order>();

    @ViewChild(MatPaginator) paginator: MatPaginator;

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }
 
    constructor(public router: Router, public userService: UserLoginService, public userParams: UserParametersService, private routeNames: RouteNames, private cognitoUtil: CognitoUtil, public orderService: OrderService, public dialog: MatDialog) {
        this.userService.isAuthenticated(this);
        this.routeNames.name.next('Compras');
        console.log("OrderComponent: constructor");
    }

    ngOnInit() {
    }

    setOrders(orders: Order[]) {
        this.dataSource = new MatTableDataSource(orders);
    }


    isLoggedIn(message: string, isLoggedIn: boolean) {
        if (!isLoggedIn) {
            this.router.navigate(['/home/login']);
        } else {
            this.cognitoUtil.getIdToken(new ListCallback(this));
        }
    }

    openDialog(): void {
        let dialogRef = this.dialog.open(CreateOrderDialogComponent, {
            width: '250px'
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            this.cognitoUtil.getIdToken(new ListCallback(this));
        });
    }

}

class ListCallback implements Callback {
    constructor(public orderComponent: OrderComponent) { }
    callback() { }
    callbackWithParam(result) {
        this.orderComponent.orderService.list(result).subscribe(orders => this.orderComponent.setOrders(orders));
    }
}

class CreateCallback implements Callback {
    constructor(public createComponent: CreateOrderDialogComponent) { }
    callback() { }
    callbackWithParam(result) {
        this.createComponent.createSubmit(result).subscribe(
            () => this.createComponent.createCallback(),
            (error) => this.createComponent.createError(error)
        );
    }
}



@Component({
    selector: 'remove-credit-card-dialog',
    template: `
    <h1 mat-dialog-title>Adicionar</h1>
    <mat-dialog-content>
        <mat-form-field>
            <input matInput placeholder="Descrição" required type="text" maxlength="50" [(ngModel)]="description" [ngModelOptions]="{standalone: true}">
        </mat-form-field>
        <mat-form-field>
            <input matInput placeholder="Valor" required type="text" maxlength="50" [(ngModel)]="total" [ngModelOptions]="{standalone: true}">
        </mat-form-field>
        <p *ngIf="errorMessage!=null" class="alert alert-danger">
            {{ errorMessage }}
        </p>
    </mat-dialog-content>
    <mat-dialog-actions>
        <button mat-raised-button color="primary" (click)="create()">Adicionar</button>
        <button mat-button mat-dialog-close>Cancelar</button>
    </mat-dialog-actions>
  `
})
export class CreateOrderDialogComponent {
    total = 0;
    description = "";
    errorMessage = null;

    constructor(
        public dialogRef: MatDialogRef<CreateOrderDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public orderService: OrderService,
        public cognitoUtil: CognitoUtil) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

    create(): void {
        this.cognitoUtil.getIdToken(new CreateCallback(this));
    }

    createSubmit(token): Observable<Object> {
        let order = {
            description: this.description,
            total: this.total
        }
        return this.orderService.create(token, order);
    }

    createCallback(): void {
        this.dialogRef.close();
    }

    createError(error) {
        let message = JSON.parse(error.error.errorMessage);
        this.errorMessage = JSON.stringify(message.errorMessage);
    }

}