import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  let userAccess = true;

  authService.isLoggedIn$.subscribe({
    next: (result: any) => {
      if (!result) {
        userAccess = result;
        router.navigate(['/login']);
      } else {
        userAccess = result;
      }
    }
  });

  return userAccess;
};
