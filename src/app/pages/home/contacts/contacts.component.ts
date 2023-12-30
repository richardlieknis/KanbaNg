import { Component, OnInit } from '@angular/core';
import { FetchSqlService } from '../../../shared/services/fetch-sql.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent implements OnInit {
  private contacts = [];
  public showContact: boolean = true;
  public contactDictionary: { [letter: string]: any[] } = {};

  public selectedContact: any = {
    name: '',
    email: '',
    phone: '',
    image: '',
    location: '',
  }

  constructor(public sql: FetchSqlService) { }

  ngOnInit(): void {
    this.sql.getContacts().subscribe((data: any) => {
      this.contacts = data.contacts;
      this.processContactData(data.contacts);
    });
  }

  /**
   * create a dictionary of contacts based on first letter of name
   * @param contacts fetched contacts from sql db
   */
  processContactData(contacts: any[]) {
    contacts.forEach((contact: any) => {
      const firstLetter = contact.name[0].toUpperCase();
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

  //TODO: open contact in content area
  openContact(id: number) {
    console.log(id);
    this.contacts.forEach((contact: any) => {
      if (contact.contact_id === id) {
        this.selectedContact = contact;
      }
    });
  }

  triggerShowContact() {
    this.showContact = !this.showContact;
  }

  test() {
    console.log(this.selectedContact);
  }



  getCurrentWindowWidth() {
    console.log(window.innerWidth);
    return window.innerWidth;
  }
}
