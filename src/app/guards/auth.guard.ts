import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);

  const isAuth = auth.isAuthenticatedSig();

  if (isAuth) return true;

  auth.login();  
  return false;
};