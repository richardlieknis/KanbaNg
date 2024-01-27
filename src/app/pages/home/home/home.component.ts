import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import e from 'express';
import { OverlayService } from '../../../shared/services/overlay.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

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

  public menuDropdown: boolean = false;
  public loggedUsername = 'Guest';

  constructor(
    private router: Router,
    private snackbar: SnackbarService,
    public overlayService: OverlayService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.closeMenuDropdown();
    this.getCurrentUser();
  }

  showSnackbar() {
    this.snackbar.show('Snackbar opened!', 'success');
  }

  toggleMenuDropdown() {
    this.menuDropdown = !this.menuDropdown;
  }

  getCurrentUser() {
    this.http.get('http://localhost:8000/api/user', { withCredentials: true })
      .subscribe((result: any) => {
        this.loggedUsername = result.name;
      });
  }

  logout() {
    const http$ = this.http.post('http://localhost:8000/api/logout', { withCredentials: true });
    http$.subscribe({
      next: (result: any) => {
        this.snackbar.show(result.message, 'success');
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1000);
      },
      error: (error: any) => {
        this.snackbar.show(error.error.detail, 'error');
      }
    });
  }

  // Close menu dropdown when click outside or on a link
  closeMenuDropdown() {
    document.addEventListener('click', (event) => {
      const menu = document.getElementById('menu');
      if (menu && !menu.contains(event.target as Node)) {
        this.menuDropdown = false;
      }
    });
  }
}
