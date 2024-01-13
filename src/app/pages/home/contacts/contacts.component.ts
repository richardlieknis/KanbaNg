import { Component, HostListener, OnInit } from '@angular/core';
import { FetchSqlService } from '../../../shared/services/fetch-sql.service';
import { OverlayService } from '../../../shared/services/overlay.service';
import { ContactService } from '../../../shared/services/contact.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent implements OnInit {
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.showContact = true;
    if (this.getCurrentWindowWidth() < 1024) {
      this.showContact = false;
    }
  }

  private contacts: any[] = [];
  public showContact: boolean = true;
  public contactDictionary: { [letter: string]: any[] } = {};

  public selectedContact: any = {
    name: '',
    email: '',
    phone: '',
    image: '',
    location: '',
  }

  constructor(
    public sql: FetchSqlService,
    public overlay: OverlayService,
    private contactService: ContactService,
  ) { }

  ngOnInit(): void {
    if (this.getCurrentWindowWidth() < 1024) {
      this.showContact = false;
    }
    this.sql.getContacts().subscribe((data: any) => {
      this.contacts = data.contacts;
      this.processContactData(data.contacts);
    });
    this.subscribeContactService();
  }

  /**
   * subscribe to contact service
   * and process update or add contact state
   */
  subscribeContactService() {
    this.contactService.contactState.subscribe((state) => {
      if (state.type === 'update') {
        this.replaceContact(state.contact);
        this.selectedContact = state.contact;
        this.processContactData(this.contacts);
      }
      if (state.type === 'delete') {
        console.log("DELETE CONTACT");
        this.contacts = this.contacts.filter((contact: any) => {
          console.log("NORMAL: ", contact);
          console.log("STATE: ", state.contact);
          return contact.contact_id !== state.contact.contact_id
        });
        this.processContactData(this.contacts);
      }
      else {
        this.contacts.push(state.contact);
        this.selectedContact = state.contact;
        this.processContactData(this.contacts);
      }
    });
  }

  /**
   * replace contact in contacts array with updated contact
   * @param contact contact to replace
   */
  replaceContact(contact: any) {
    this.contacts.forEach((c: any, index) => {
      if (c.contact_id === contact.contact_id) {
        this.contacts[index] = contact;
      }
    });
  }

  /**
   * create a dictionary of contacts based on first letter of name
   * @param contacts fetched contacts from sql db
   */
  processContactData(contacts: any[]) {
    this.contactDictionary = {};
    contacts.forEach((contact: any) => {
      const firstLetter = contact?.name[0].toUpperCase();
      if (!this.contactDictionary[firstLetter]) {
        this.contactDictionary[firstLetter] = [contact];
      } else {
        this.contactDictionary[firstLetter].push(contact);
      }
    });
  }

  /**
   * get keys from contactDictionary and sort them alphabetically
   * @returns array of keys from contactDictionary
   */
  getContactDictionaryKeys() {
    return Object.keys(this.contactDictionary).sort();
  }

  openContact(id: number) {
    this.changeContentMobile();
    this.contacts.forEach((contact: any) => {
      if (contact.contact_id === id) {
        this.selectedContact = contact;
      }
    });
  }

  changeContentMobile() {
    if (this.getCurrentWindowWidth() < 1024) {
      this.showContact = !this.showContact;
    }
  }

  triggerShowContact() {
    this.showContact = !this.showContact;
  }

  getCurrentWindowWidth() {
    return window.innerWidth;
  }
}
