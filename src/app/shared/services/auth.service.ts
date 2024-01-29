import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';
import { SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private backendUrl = 'http://localhost:8000/api/';
  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this._isLoggedIn$.asObservable();

  guestEmail = 'guest@kanbang.com';
  guestPassword = '1c#7g!f@re&7m';

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackbar: SnackbarService,
  ) { }

  login(data: any) {
    console.log(data);
    return this.http.post(this.backendUrl + 'login', data, { withCredentials: true })
      .subscribe({
        next: (res: any) => {
          this._isLoggedIn$.next(true);
          this.snackbar.show(res.message, 'success');
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 1000);
        },
        error: (err: any) => {
          this.snackbar.show(err.error.detail, 'error');
        }
      });
  }

  logout() {
    const http$ = this.http.post(this.backendUrl + 'logout', { withCredentials: true });
    http$.subscribe({
      next: (result: any) => {
        this._isLoggedIn$.next(false);
        document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'; //NOTE: funtioniert nicht
        this.snackbar.show(result.message, 'success');
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 300);
      },
      error: (error: any) => {
        this.snackbar.show(error.error.detail, 'error');
      }
    });
  }

}
