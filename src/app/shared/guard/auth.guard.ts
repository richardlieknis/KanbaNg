import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  const token = localStorage.getItem('jwt');
  if (token) {
    return true
  }

  return authService.isLoggedIn$.pipe(
    tap((isLoggedIn) => {
      if (!isLoggedIn) {
        router.navigate(['/login']);
      }
    }),
    map((isLoggedIn) => isLoggedIn)
  );
};
