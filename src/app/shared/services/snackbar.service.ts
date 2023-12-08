import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  private snackbarSubject = new Subject<any>();
  public snackbarState = this.snackbarSubject.asObservable();

  show(msg: string, type?: string) {
    this.snackbarSubject.next({
      show: true,
      msg,
      type
    });
  }
}
