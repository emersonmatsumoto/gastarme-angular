import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../notification.service';
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/do'
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'mt-snackbar',
  template: ''
})
export class SnackbarComponent implements OnInit {

  constructor(private notificationService: NotificationService, public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.notificationService.notifier
      .do(message => {
        this.snackBar.open(message, "", {
          duration: 2000,
        });     
    }).subscribe();
  }

}
