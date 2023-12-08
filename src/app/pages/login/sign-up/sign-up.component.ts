import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  public minNameLength = 5;
  public minPasswordLength = 5;

  private backendUrl = 'http://localhost/backend/';


  constructor(
    private http: HttpClient,
    private snackbar: SnackbarService,
    private router: Router,
  ) { }

  signupForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(this.minNameLength)]),
    email: new FormControl('', [Validators.required, Validators.email, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    password: new FormControl('', [Validators.required, Validators.minLength(this.minPasswordLength)]),
  });

  /**
   * Creates a new user in SQL database via PHP
   * and returns a success/error message via snackbar
   */
  onSubmit() {
    this.http.post(this.backendUrl + 'create_user.php',
      this.signupForm.value, { responseType: 'text' })
      .subscribe((result: any) => {
        result = JSON.parse(result);
        if (result.status === 'success') {
          this.snackbar.show('Your account has been created successfully!', 'success');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1000);
        } else {
          this.snackbar.show('Something went wrong. :(', 'error');
        }
      });
  }
}
