import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class FetchSqlService {
  private backendUrl = 'http://localhost/backend/';

  constructor(private http: HttpClient) { }

  getContacts(): Observable<any> {
    return this.http.get(this.backendUrl + 'get_contacts.php');
  }
}
