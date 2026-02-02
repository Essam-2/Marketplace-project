import { AuthService } from './services/auth.service';

/**
 * Initialize authentication before app starts
 * Checks for authentication cookie and sets auth state
 */
export function initializeAuth(authService: AuthService) {
  return (): Promise<void> => {

    return new Promise((resolve) => {
      authService.loadUser().subscribe({
        next: () => {
          resolve();
        },
        error: () => {
          resolve();
        },
        complete: () => {
          resolve();
        },
      });
    });
  };
}