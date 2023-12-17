import { Component, Injectable, Input, OnDestroy, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { SnackbarService } from '../../services/snackbar.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.scss',
  animations: [
    trigger('state', [
      transition(':enter', [
        style({ bottom: '-100px', opacity: 0 }),
        animate('300ms ease-in', style({ bottom: '70px', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('150ms cubic-bezier(0.4, 0.0, 0.2, 1)', style({ bottom: '-100px', opacity: 0 }))
      ])
    ])
  ]
})

export class SnackbarComponent implements OnInit, OnDestroy {
  public show = false;
  public icon = 'error';
  public msg: string = '';
  public type: string = '';
  private snackbarSub: Subscription = new Subscription();

  constructor(
    private snackbarService: SnackbarService
  ) { }

  ngOnInit() {
    this.snackbarSub = this.snackbarService.snackbarState
      .subscribe((state) => {
        if (state.type) {
          this.type = state.type;
        } else {
          this.type = 'success';
        }

        if (this.type === 'success') {
          this.icon = 'check';
        } else if (this.type === 'error') {
          this.icon = 'error';
        }
        // else if (this.type === 'warning') {
        //   this.icon = 'warning';
        // } else if (this.type === 'info') {
        //   this.icon = 'info';
        // }

        this.msg = state.msg;
        this.show = state.show;
        setTimeout(() => {
          this.show = false;
        }, 4000)
      });
  }

  ngOnDestroy() {
    this.snackbarSub.unsubscribe();
  }
}
