import { Component, Input } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.scss',
  animations: [
    trigger('test', [
      state('visible', style({ opacity: 1, transform: 'translateY(0)' })),
      state('hidden', style({ opacity: 0, transform: 'translateY(100%)' })),
      transition('hidden => visible', animate('300ms ease-in')),
      transition('visible => hidden', animate('300ms ease-out')),
    ])
  ]
})

export class SnackbarComponent {
  @Input() state: 'visible' | 'hidden' = 'hidden';
  public event: string;

  constructor() {
    this.event = 'visible';
  }
}
