import { Component } from '@angular/core';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { Router } from '@angular/router';
import { NavToolbarComponent } from '../../shared/navbar/nav-toolbar/nav-toolbar.component';
import { LoginService } from './login.service';
import { LoginResponse } from './interfaces/login-response';
import { LoginRequest } from './interfaces/login-request';
import { AuthService } from '../../core/services/auth.service';

/* Role-to-dashboard mapping so each role lands on the correct page */
const ROLE_DASHBOARD: Record<string, string> = {
  admin: '/dashboard/admin',
  manager: '/dashboard/manager',
};

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    imports: [
        MatCard,
        MatCardTitle,
        MatCardContent,
        FormsModule,
        MatFormField,
        MatInput,
        MatLabel,
        NavToolbarComponent,
    ]
})
export class LoginComponent {
  user = { username: '', password: '' };
  isMenuOpen = false;

  constructor(
    private loginService: LoginService,
    private authService: AuthService,
    private router: Router,
  ) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  login(): void {
    const request: LoginRequest = {
      username: this.user.username,
      password: this.user.password,
    };

    this.loginService.login(request).subscribe({
      next: (response: LoginResponse) => {
        if (response.loginStatus) {
          /* Store JWT token and role so the interceptor and guard can use them */
          localStorage.setItem('authToken', response.token);
          this.authService.setUserRole = response.role || 'client';
          alert('Login Success!');
          /* Navigate to the dashboard that matches the user's role */
          const dashboard = ROLE_DASHBOARD[response.role] || '/dashboard';
          this.router.navigate([dashboard]);
        } else {
          alert('Incorrect username or password !');
        }
      },
      error: (err) => {
        console.error('Error while trying to log in', err);
        alert('Error happen try later');
      },
    });
  }
}
