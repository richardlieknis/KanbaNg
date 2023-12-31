import { Component, HostListener, OnInit } from '@angular/core';
import { FetchSqlService } from '../../../shared/services/fetch-sql.service';
import { OverlayService } from '../../../shared/services/overlay.service';

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

  constructor(
    public sql: FetchSqlService,
    public overlay: OverlayService,
  ) { }

  ngOnInit(): void {
    if (this.getCurrentWindowWidth() < 1024) {
      this.showContact = false;
    }
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
