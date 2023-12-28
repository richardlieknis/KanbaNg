import { Component, OnInit } from '@angular/core';
import { FetchSqlService } from '../../../shared/services/fetch-sql.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent implements OnInit {
  public contacts: any[] = [];

  constructor(public sql: FetchSqlService) { }

  ngOnInit(): void {
    this.sql.getContacts().subscribe((data: any) => {
      this.contacts = data.contacts;
    });
  }
}
