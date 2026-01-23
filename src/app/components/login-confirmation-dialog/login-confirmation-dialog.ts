import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login-confirmation-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './login-confirmation-dialog.html',
  styleUrls: ['./login-confirmation-dialog.scss']
})
export class LoginConfirmationDialogComponent {
  constructor(public dialogRef: MatDialogRef<LoginConfirmationDialogComponent>) {}
}
