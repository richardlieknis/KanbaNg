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

  onSubmit() {
    this.authService.login(this.signinForm.value);
  }

  loginAsGuest() {
    this.signinForm.setValue({
      email: this.authService.guestEmail,
      password: this.authService.guestPassword
    });
    this.onSubmit();
  }
}
