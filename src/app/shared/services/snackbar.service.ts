import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  private snackbarSubject = new Subject<any>();
  public snackbarState = this.snackbarSubject.asObservable();


  /** Its a function to show snackbar
   *  It takes two parameters msg and type as string
   *  type is optional -> default value is 'success'
   * @param msg as string, message to show in snackbar
   * @param type as string, like 'success', 'error'..
   */
  show(msg: string, type?: string) {
    this.snackbarSubject.next({
      show: true,
      msg,
      type
    });
  }
}
