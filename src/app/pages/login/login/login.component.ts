import { HttpClient } from '@angular/common/http';
import { Component, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  constructor(
    private http: HttpClient,
    private snackbar: SnackbarService,
    private router: Router
  ) { }

  signinForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    password: new FormControl('', [Validators.required, Validators.minLength(5)])
  });


  onSubmit() {
    this.http.post('http://localhost/backend/verify_user.php', this.signinForm.value)
      .subscribe((result: any) => {
        if (result.status === 'success') {
          this.snackbar.show(result.message, 'success');
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 1000);
        } else {
          this.snackbar.show(result.message, 'error');
        }
      });
  }
}
