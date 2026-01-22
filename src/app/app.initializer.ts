import { AuthService } from './services/auth.service';

/**
 * Initialize authentication before app starts
 * Checks for authentication cookie and sets auth state
 */
export function initializeAuth(authService: AuthService) {
  return (): Promise<void> => {
    console.log('APP_INITIALIZER: Checking authentication...');

    return new Promise((resolve) => {
      authService.loadUser().subscribe({
        next: () => {
          console.log('APP_INITIALIZER: Auth check complete');
          resolve();
        },
        error: () => {
          console.log('APP_INITIALIZER: Auth check complete (with error)');
          resolve();
        },
        complete: () => {
          resolve();
        },
      });
    });
  };
}
