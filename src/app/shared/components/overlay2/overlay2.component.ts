import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SnackbarService } from '../../services/snackbar.service';
import { OverlayService } from '../../services/overlay.service';

@Component({
  selector: 'app-overlay2',
  templateUrl: './overlay2.component.html',
  styleUrl: './overlay2.component.scss',
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
export class Overlay2Component implements OnInit, OnDestroy {
  public show = false;
  public animIsRunning = false;
  public component: string | null = null;
  public title: string = '';
  public subtitle: string = '';
  private overlaySub: Subscription = new Subscription();

  constructor(
    private snackbarService: SnackbarService,
    public overlayService: OverlayService,
  ) { }

  ngOnInit() {
    this.overlayService.overlay2State
      .subscribe((state) => {
        this.component = state.component;
        this.subtitle = state.subtitle || '';
        this.show = state.show;
        this.animIsRunning = true;
        this.setTitle(state.component);
      });
  }

  ngOnDestroy() {
    this.overlaySub.unsubscribe();
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
    if (title) {
      this.title = title[0].toUpperCase() + title.slice(1);
    }
  }
}
