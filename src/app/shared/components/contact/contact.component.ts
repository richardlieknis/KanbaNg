import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SnackbarService } from '../../services/snackbar.service';
import { OverlayService } from '../../services/overlay.service';
import { Subject } from 'rxjs';
import { ContactService } from '../../services/contact.service';
import e from 'express';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnInit {
  @Input() type: string = 'edit';
  @Input() contact!: any;
  @ViewChild('addBtn') addBtn!: ElementRef;
  @ViewChild('updateBtn') updateBtn!: ElementRef;

  private backendUrl = 'http://localhost/backend/';

  public minNameLength = 5;
  public minPhoneLength = 5;
  public minLocationLength = 5;

  public submitType: string = '';


  contactForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(this.minNameLength)]),
    email: new FormControl('', [Validators.required, Validators.email, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    phone: new FormControl('', [Validators.pattern("^[0-9]*$"), Validators.minLength(this.minPhoneLength)]),
    location: new FormControl('', [Validators.minLength(this.minLocationLength)]),
  });

  constructor(
    private http: HttpClient,
    private snackbar: SnackbarService,
    private overlay: OverlayService,
    private contactService: ContactService,
    private dialogService: DialogService
  ) { }

  ngOnInit(): void {
    this.setFormType(this.type);
    this.contactForm.patchValue({
      name: this.contact?.name || '',
      email: this.contact?.email || '',
      phone: this.contact?.phone || '',
      location: this.contact?.location || ''
    });
  }

  setFormType(type: string): void {
    this.type = type;
  }

  /**
   * submit form, create or update contact
   * @param submitType type of submit button
   * @param contactId selected contact id
   */
  onSubmit(submitType: string, contactId?: number) {
    if (submitType === 'add') {
      this.createContact();
    } else if (submitType === 'update') {
      this.updateContact(contactId);
    }
  }

  createContact() {
    this.http.post(this.backendUrl + 'create_contact.php',
      this.contactForm.value, { responseType: 'text' })
      .subscribe((result: any) => {
        result = JSON.parse(result);
        if (result.status === 'success') {
          this.contactService.emitContact(this.contactForm.value, 'add');
          this.snackbar.show(result.message, 'success');
          this.overlay.hide();
        } else {
          this.snackbar.show(result.message, 'error');
        }
      });
  }

  /**
   * update contact, before update contact, we need to get contact id
   * after that combine contact id with form data and send to backend
   * @param contactId selected contact id
   */
  updateContact(contactId?: number) {
    const phoneNumber: string = this.contactForm.value.phone.toString();

    const formData = {
      ...this.contactForm.value,
      contact_id: contactId,
      phone: phoneNumber
    };

    this.http.post(this.backendUrl + 'update_contact.php',
      formData, { responseType: 'text' })
      .subscribe((result: any) => {
        result = JSON.parse(result);
        if (result.status === 'success') {
          this.contactService.emitContact(formData, 'update');
          this.snackbar.show(result.message, 'success');
          this.overlay.hide();
        } else {
          this.snackbar.show(result.message, 'error');
        }
      });
  }

  //TODO: zeige namen des zu löschenden Kontakts an
  deleteContact(contact: any) {
    this.dialogService.confirm('This contact will be permanently deleted.').then((confirmed) => {
      if (confirmed) {
        this.http.post(this.backendUrl + 'delete_contact.php',
          { contact_id: contact.contact_id }, { responseType: 'text' })
          .subscribe((result: any) => {
            result = JSON.parse(result);
            if (result.status === 'success') {
              this.contactService.emitContact(contact, 'delete');
              this.snackbar.show(result.message, 'success');
              this.overlay.hide();
            } else {
              this.snackbar.show(result.message, 'error');
            }
          });
      }
    });

  }
}
