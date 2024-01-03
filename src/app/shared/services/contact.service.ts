import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private contactSubject = new Subject<any>();

  public contactState = this.contactSubject.asObservable();

  constructor() { }

  /**
   * emit contact to contacts component
   * @param contact contact to emit
   */
  emitContact(contact: any, type?: string) {
    this.contactSubject.next({ contact, type });
  }
}
