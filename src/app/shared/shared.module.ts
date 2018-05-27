import { NgModule, ModuleWithProviders } from "@angular/core";
import { SnackbarComponent } from './messages/snackbar/snackbar.component';
import { NotificationService } from "./messages/notification.service";

@NgModule({
    declarations: [  ],
    imports: [  ],
    exports: [  ]
})
export class SharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule,
            providers: [NotificationService]
        }
    }
}