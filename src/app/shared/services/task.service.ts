import { Injectable } from '@angular/core';
import { FetchSqlService } from './fetch-sql.service';
import { Observable, Subject, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private subtaskSubject = new Subject<any>();

  public subtaskState = this.subtaskSubject.asObservable();

  constructor(
    private sql: FetchSqlService,
  ) { }

  createCategoryDictionary(): Observable<any> {
    return this.sql.getCategories().pipe(
      map((data: any) => {
        return data.categories.reduce((acc: any, category: any) => {
          acc[category.category_id] = category;
          return acc;
        }, {});
      })
    );
  }

  createAssigneeDictionary(): Observable<any> {
    return this.sql.getContacts().pipe(
      map((data: any) => {
        return data.contacts.reduce((acc: any, contact: any) => {
          acc[contact.contact_id] = contact;
          return acc;
        }, {});
      })
    );
  }

  /**
   * emit subtask to task-show component
   * @param subtask subtask to emit
   */
  emitSubtask(subtask: any) {
    this.subtaskSubject.next(subtask);
  }
}
