import { Component } from '@angular/core';
import { OverlayService } from '../../../shared/services/overlay.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {
  constructor(
    public overlayService: OverlayService,
  ) { }
}
