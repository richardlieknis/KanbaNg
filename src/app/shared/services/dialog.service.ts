import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private dialogSubject = new Subject<any>();
  public dialogState = this.dialogSubject.asObservable();

  constructor() { }

  show(object?: any) {
    this.dialogSubject.next({
      show: true,
      object
    });
  }

  hide() {
    this.dialogSubject.next({
      show: false
    });
  }

  confirm(message: string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.show({
        message,
        resolve
      })
    })
  }
}
