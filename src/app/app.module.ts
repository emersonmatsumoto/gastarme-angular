import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {AppComponent} from "./app.component";
import {UserRegistrationService} from "./service/user-registration.service";
import {UserParametersService} from "./service/user-parameters.service";
import {UserLoginService} from "./service/user-login.service";
import {CognitoUtil} from "./service/cognito.service";
import {routing} from "./app.routes";
import {AboutComponent, HomeComponent, HomeLandingComponent} from "./public/home.component";
import {AwsUtil} from "./service/aws.service";
import {UseractivityComponent} from "./secure/useractivity/useractivity.component";
import {MyProfileComponent} from "./secure/profile/myprofile.component";
import {SecureHomeComponent} from "./secure/landing/securehome.component";
import {JwtComponent} from "./secure/jwttokens/jwt.component";
import {DynamoDBService} from "./service/ddb.service";
import {LoginComponent} from "./public/auth/login/login.component";
import {RegisterComponent} from "./public/auth/register/registration.component";
import {ForgotPassword2Component, ForgotPasswordStep1Component} from "./public/auth/forgot/forgotPassword.component";
import {LogoutComponent, RegistrationConfirmationComponent} from "./public/auth/confirm/confirmRegistration.component";
import {ResendCodeComponent} from "./public/auth/resend/resendCode.component";
import {NewPasswordComponent} from "./public/auth/newpassword/newpassword.component";
import { MFAComponent } from './public/auth/mfa/mfa.component';
import { MaterialModule } from './material.module';
import { RouteNames } from "./service/route-names.service";
import { CreditCardComponent, RemoveCreditCardDialogComponent } from './secure/creditcard/creditcard.component';
import { CreditCardService } from "./service/credit-card.service";
import { HttpClientModule } from "@angular/common/http";
import { AddCreditCardComponent } from './secure/add-creditcard/add-creditcard.component';
import { WalletComponent } from './secure/wallet/wallet.component';
import { WalletService } from "./service/wallet.service";
import { OrderService } from "./service/order.service";
import { OrderComponent, CreateOrderDialogComponent } from './secure/order/order.component';

@NgModule({
    declarations: [
        NewPasswordComponent,
        LoginComponent,
        LogoutComponent,
        RegistrationConfirmationComponent,
        ResendCodeComponent,
        ForgotPasswordStep1Component,
        ForgotPassword2Component,
        RegisterComponent,
        MFAComponent,
        AboutComponent,
        HomeLandingComponent,
        HomeComponent,
        UseractivityComponent,
        MyProfileComponent,
        SecureHomeComponent,
        JwtComponent,
        AppComponent,
        CreditCardComponent,
        AddCreditCardComponent,
        RemoveCreditCardDialogComponent,
        CreateOrderDialogComponent,
        WalletComponent,
        OrderComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,
        HttpModule,
        MaterialModule,
        routing
    ],
    providers: [
        CognitoUtil,
        AwsUtil,
        DynamoDBService,
        UserRegistrationService,
        UserLoginService,
        UserParametersService,
        CreditCardService,
        WalletService,
        OrderService,
        RouteNames],
    bootstrap: [AppComponent],
    entryComponents: [RemoveCreditCardDialogComponent, CreateOrderDialogComponent]
})
export class AppModule {
}