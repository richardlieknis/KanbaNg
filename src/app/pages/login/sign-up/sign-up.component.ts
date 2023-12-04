import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { min } from 'rxjs';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  minNameLength = 5;
  minPasswordLength = 5;

  signupForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(this.minNameLength)]),
    email: new FormControl('', [Validators.required, Validators.email, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    password: new FormControl('', [Validators.required, Validators.minLength(this.minPasswordLength)]),
  });

  onSubmit() {
    console.log(this.signupForm.valid);
    console.log(this.signupForm.value);
  }
}
