import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SnackbarService } from '../../../shared/services/snackbar.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  public navLinks = [
    { path: '/home', label: 'Home', icon: 'home' },
    { path: '/board', label: 'Board', icon: 'board' },
    { path: '/add-task', label: 'Add Task', icon: 'add-task' },
    { path: '/contacts', label: 'Contacts', icon: 'contacts' },
  ];

  public legalLinks = [
    { path: '/legal-notice', label: 'Legal Notice', icon: 'error' },
    // { path: '/terms-of-service', label: 'Terms of Service', icon: 'error' },
  ];

  constructor(
    private router: Router,
    private snackbar: SnackbarService
  ) { }

  showSnackbar() {
    this.snackbar.show('Snackbar opened!', 'success');
  }
}
