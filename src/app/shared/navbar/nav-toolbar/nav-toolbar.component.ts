import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NgClass } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'nav-toolbar',
    templateUrl: './nav-toolbar.component.html',
    styleUrl: './nav-toolbar.component.css',
    imports: [
        RouterOutlet,
        RouterLink,
        NgClass,
    ]
})
export class NavToolbarComponent {
  isMenuOpen = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  /* Expose auth state to the template for conditional link display */
  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  /* Clear auth data and redirect to login page */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
