import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CustomDialogComponent } from '../../shared/components/custom-dialog/custom-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
  ) {}

  //This functions allows or not access to admin and manager page
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean {
    const userRole = this.authService.getUserRole; // e.g., 'admin' or 'manager'
    const requiredRole = route.data['role'];

    if (userRole === requiredRole) {
      return true;
    } else {
      const dialogRef = this.dialog.open(CustomDialogComponent, {
        data: {
          title: 'Access Denied',
          message: 'You are not allowed to access this page',
        },
      });

      dialogRef.afterClosed().subscribe(() => {
        this.router.navigate(['/home']); // Redirect to home after dialog is closed
      });

      return false;
    }
  }
}
