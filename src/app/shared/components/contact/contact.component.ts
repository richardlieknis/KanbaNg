import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SnackbarService } from '../../services/snackbar.service';
import { OverlayService } from '../../services/overlay.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnInit {
  @Input() type: string = 'edit';
  @Input() contact: any;

  public minNameLength = 5;
  public minPhoneLength = 10;
  public minLocationLength = 5;

  private backendUrl = 'http://localhost/backend/';

  contactForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(this.minNameLength)]),
    email: new FormControl('', [Validators.required, Validators.email, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    phone: new FormControl('', [Validators.minLength(this.minPhoneLength)]),
    location: new FormControl('', [Validators.minLength(this.minLocationLength)]),
  });

  constructor(
    private http: HttpClient,
    private snackbar: SnackbarService,
    private overlay: OverlayService,
  ) { }

  ngOnInit(): void {
    this.setFormType(this.type);
  }

  setFormType(type: string): void {
    this.type = type;
  }

  onSubmit() {
    this.http.post(this.backendUrl + 'create_contact.php',
      this.contactForm.value, { responseType: 'text' })
      .subscribe((result: any) => {
        result = JSON.parse(result);
        if (result.status === 'success') {
          this.snackbar.show('Your contact has been created successfully!', 'success');
          this.overlay.hide();
        } else {
          this.snackbar.show('Something went wrong. :(', 'error');
        }
      });
  }
}
