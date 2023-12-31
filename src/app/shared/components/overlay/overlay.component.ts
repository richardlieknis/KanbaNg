import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { SnackbarService } from '../../services/snackbar.service';
import { OverlayService } from '../../services/overlay.service';
import { Subscription } from 'rxjs';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-overlay',
  templateUrl: './overlay.component.html',
  styleUrl: './overlay.component.scss',
  animations: [
    trigger('state', [
      transition(':enter', [
        style({ left: '100%', opacity: 0 }),
        animate('300ms ease-in', style({
          left: '30%',
          opacity: 1
        }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ left: '100%', opacity: 1 }))
      ])
    ]),
    // BACKDROP ANIMATION
    trigger('backdrop', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-in', style({
          opacity: 1
        }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0 }))
      ])
    ]),

  ]
})
export class OverlayComponent implements OnInit, OnDestroy {
  public addTaskType: 'show' | 'edit' = 'show';
  public show = false;
  public animIsRunning = false;
  public component: string | null = null;
  public title: string = '';
  public subtitle: string = '';
  public object: any = null;
  private overlaySub: Subscription = new Subscription();

  public statusInputActive: boolean = false;
  public statusDropdown: boolean = false;

  public categories: any[] = [];

  public statusArray = ['todo', 'progress', 'feedback', 'done'];

  constructor(
    private snackbarService: SnackbarService,
    public overlayService: OverlayService,
    private taskService: TaskService
  ) { }

  ngOnInit() {
    this.overlayService.overlayState
      .subscribe((state) => {
        this.component = state.component;
        this.subtitle = state.subtitle || '';
        this.object = state.object || null;
        this.show = state.show;
        this.animIsRunning = true;
        this.setTitle(state.component);
      });
    this.loadCategories();
    this.taskService.addTaskType.subscribe((type: 'show' | 'edit') => {
      this.addTaskType = type;
    });
  }

  ngOnDestroy() {
    this.overlaySub.unsubscribe();
  }

  loadCategories() {
    this.taskService.createCategoryDictionary().subscribe((data: any) => {
      this.categories = data;
    });
  }

  checkIfTask() {
    return this.object?.task_id ? true : false;
  }

  /**
   * set animation state to false when animation is done
   * @param event - state of animation
   */
  overlayBoxAnimation(event: any) {
    if (event.toState === 'void') {
      this.animIsRunning = false;
    }
  }

  setTitle(title: string) {
    title = title?.replace(/-/g, ' ');
    this.title = title;
  }

  toggleStatusDropdown() {
    this.statusDropdown = !this.statusDropdown;
  }

  changeStatus(status: string) {
    this.object.status = status;
    this.toggleStatusDropdown();
    this.taskService.emitTaskStatus(status);
  }

  translateStatus(status: string) {
    switch (status) {
      case 'todo':
        return 'To Do';
      case 'progress':
        return 'In Progress';
      case 'feedback':
        return 'Awaiting Feedback';
      case 'done':
        return 'Done';
      default:
        return 'todo';
    }
  }
}
