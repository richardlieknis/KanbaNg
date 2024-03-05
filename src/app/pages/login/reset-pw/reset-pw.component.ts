import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-reset-pw',
  templateUrl: './reset-pw.component.html',
  styleUrl: './reset-pw.component.scss'
})
export class ResetPwComponent {
  passwordForm: FormGroup;

  private token: any = '';

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
  ) {
    this.passwordForm = new FormGroup({
      password: new FormControl('', [Validators.required, Validators.minLength(5)]),
      password2: new FormControl('', [Validators.required, Validators.minLength(5)]),
    },
      {
        validators: this.passwordMatchValidator,

      });
  }


  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get('token')?.replace(/,/g, '.');
  }

  onSubmit() {
    this.authService.changePassword({ token: this.token, password: this.passwordForm.value });
  }

  // compare passwords
  passwordMatchValidator(control: AbstractControl) {
    return control.get('password')?.value ===
      control.get('password2')?.value
      ? null
      : { mismatch: true };
  }
}
