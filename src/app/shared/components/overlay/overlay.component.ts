import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { SnackbarService } from '../../services/snackbar.service';
import { OverlayService } from '../../services/overlay.service';
import { Subscription } from 'rxjs';
import e from 'express';

@Component({
  selector: 'app-overlay',
  templateUrl: './overlay.component.html',
  styleUrl: './overlay.component.scss',
  animations: [
    trigger('state', [
      transition(':enter', [
        style({ transform: 'translate(100%, -50%)', opacity: 1 }),
        animate('300ms ease-in', style({
          transform: 'translate(-50%, -50%)',
          opacity: 1
        }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translate(100%, -50%)', opacity: 1 }))
      ])
    ]),
  ]
})
export class OverlayComponent implements OnInit, OnDestroy {
  public show = false;
  public animIsRunning = false;
  public component: string | null = null;
  private overlaySub: Subscription = new Subscription();

  constructor(
    private snackbarService: SnackbarService,
    public overlayService: OverlayService,
  ) { }

  ngOnInit() {
    this.overlayService.overlayState
      .subscribe((state) => {
        this.component = state.component;
        this.show = state.show;
        this.animIsRunning = true;
      });
  }

  ngOnDestroy() {
    this.overlaySub.unsubscribe();
  }

  test(event: any) {
    if (event.toState === 'void') {
      this.animIsRunning = false;
    }
    // event.stopPropagation();
  }
}
