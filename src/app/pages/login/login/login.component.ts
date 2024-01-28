import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { Router } from '@angular/router';
import e from 'express';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  private backendUrl = 'http://localhost:8000/api/';

  constructor(
    private http: HttpClient,
    private snackbar: SnackbarService,
    private router: Router,
    private authService: AuthService,
  ) { }

  signinForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    password: new FormControl('', [Validators.required, Validators.minLength(5)])
  });

  ngOnInit() {
    // console.log(this.getAccessToken());
  }


  // onSubmit() {
  //   this.http.post('http://localhost/backend/verify_user.php', this.signinForm.value)
  //     .subscribe((result: any) => {
  //       if (result.status === 'success') {
  //         this.snackbar.show(result.message, 'success');
  //         setTimeout(() => {
  //           this.router.navigate(['/home']);
  //         }, 1000);
  //       } else {
  //         this.snackbar.show(result.message, 'error');
  //       }
  //     });
  // }

  onSubmit() {
    this.authService.login(this.signinForm.value);
    // const http$ = this.http.post(this.backendUrl + 'login', this.signinForm.value,
    //   { withCredentials: true });
    // http$.subscribe({
    //   next: (result: any) => {
    //     console.log("result: ", result.jwt);
    //     this.snackbar.show(result.message, 'success');
    //     setTimeout(() => {
    //       this.router.navigate(['/home']);
    //     }, 1000);
    //   },
    //   error: (error: any) => {
    //     this.snackbar.show(error.error.detail, 'error');
    //   }
    // });
  }
}
