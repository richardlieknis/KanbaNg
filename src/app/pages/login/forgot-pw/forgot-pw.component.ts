import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-forgot-pw',
  templateUrl: './forgot-pw.component.html',
  styleUrl: './forgot-pw.component.scss'
})
export class ForgotPwComponent {


  emailForm: FormControl = new FormControl('', [Validators.required,
  Validators.email, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]);

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
  ) { }


  onSubmit() {

    this.authService.resetPassword({ email: this.emailForm.value });
  }
}
