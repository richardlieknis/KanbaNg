import { Injectable } from '@angular/core';
import { FetchSqlService } from './fetch-sql.service';
import { Observable, Subject, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private taskSubject = new Subject<any>();
  private updateTaskSubject = new Subject<any>();
  private addTaskTypeSubject = new Subject<any>();
  private taskStatusSubject = new Subject<any>();

  public taskState = this.taskSubject.asObservable();
  public updateTaskState = this.updateTaskSubject.asObservable();
  public addTaskType = this.addTaskTypeSubject.asObservable();
  public taskStatus = this.taskStatusSubject.asObservable();

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
   * emit task to board component
   * @param task task to emit
   */
  emitTask(task: any) {
    this.taskSubject.next(task);
  }

  emitUpdateTask(task: any) {
    this.updateTaskSubject.next(task);
  }

  emitAddTaskType(type: string) {
    this.addTaskTypeSubject.next(type);
  }

  emitTaskStatus(status: string) {
    this.taskStatusSubject.next(status);
  }
}
