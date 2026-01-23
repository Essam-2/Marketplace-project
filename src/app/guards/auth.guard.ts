import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';
import { LoginConfirmationDialogComponent } from '../components/login-confirmation-dialog/login-confirmation-dialog';
import { firstValueFrom } from 'rxjs';

export const authGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const dialog = inject(MatDialog);

  const isAuth = auth.isAuthenticatedSig();

  if (isAuth) return true;

  // Show confirmation dialog
  const dialogRef = dialog.open(LoginConfirmationDialogComponent, {
    width: '400px',
    disableClose: false
  });

  const result = await firstValueFrom(dialogRef.afterClosed());

  // If user clicked "Login", redirect to login
  if (result === true) {
    auth.login();
  }

  // Always return false to prevent navigation
  // (user will either go to login or stay on current page)
  return false;
};