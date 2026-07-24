import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

/* Role-to-dashboard path mapping — same as login.component.ts */
const ROLE_DASHBOARD: Record<string, string> = {
  admin: '/dashboard/admin',
  manager: '/dashboard/manager',
};

@Component({
    selector: 'app-dashboard',
    imports: [],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  /* Redirect to the correct role-based dashboard on load */
  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    const role = this.authService.getUserRole;
    const dashboard = ROLE_DASHBOARD[role];

    if (dashboard) {
      this.router.navigate([dashboard]);
    }
    /* Staff/client roles stay on /dashboard — the template acts as a generic landing page */
  }
}
