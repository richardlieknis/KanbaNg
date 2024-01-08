import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { TaskService } from './task.service';

@Injectable({
  providedIn: 'root'
})
export class OverlayService {
  private overlaySubject = new Subject<any>();
  private overlay2Subject = new Subject<any>();
  public overlayState = this.overlaySubject.asObservable();
  public overlay2State = this.overlay2Subject.asObservable();

  private lastOverlay: string | null = null;

  constructor(
    private taskService: TaskService
  ) { }

  /** Show overlay - 2 types: standard and overlay with banner
   * @param component as string, component name to show in overlay
   * @param type as string, type of overlay to show
   * @param subtitle as string, subtitle to show in overlay
   */
  show(component: string, type?: string, subtitle?: string, image?: string, object?: any) {
    if (type === 'standard') {
      this.lastOverlay = 'standard';
      this.overlaySubject.next({
        show: true,
        component,
        subtitle,
        object
      });
    } else {
      this.lastOverlay = null;
      this.overlay2Subject.next({
        show: true,
        component,
        subtitle,
        image,
        object
      });
    }
  }

  /** close overlay */
  hide() {
    this.taskService.emitAddTaskType('show');
    if (this.lastOverlay === 'standard') {
      this.overlaySubject.next({
        show: false,
        component: null
      });
    } else {
      this.overlay2Subject.next({
        show: false,
        component: null
      });
    }
  }
}
