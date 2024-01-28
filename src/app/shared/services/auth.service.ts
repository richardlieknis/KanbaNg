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

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackbar: SnackbarService,
  ) { }

  login(data: any) {
    return this.http.post(this.backendUrl + 'login', data, { withCredentials: true })
      .subscribe({
        next: (res: any) => {
          console.log("result: ", res.jwt);
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

}
