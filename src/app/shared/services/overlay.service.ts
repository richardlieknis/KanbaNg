import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OverlayService {
  private overlaySubject = new Subject<any>();
  public overlayState = this.overlaySubject.asObservable();

  /** Its a function to show overlay
   *  It takes a parameter component as string and optional subtitle as string
   * @param component as string, component name to show in overlay
   */
  show(component: string, subtitle?: string) {
    this.overlaySubject.next({
      show: true,
      component,
      subtitle
    });
  }

  /** Its a function to hide overlay */
  hide() {
    this.overlaySubject.next({
      show: false,
      component: null
    });
  }

  constructor() { }
}
