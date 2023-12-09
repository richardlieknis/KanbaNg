import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SnackbarService } from '../../../shared/services/snackbar.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(
    private router: Router,
    private snackbar: SnackbarService
  ) { }

  showSnackbar() {
    this.snackbar.show('Snackbar opened!', 'error');
  }
}
