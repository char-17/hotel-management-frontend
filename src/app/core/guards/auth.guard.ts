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

  /* Check if the user's role is included in the route's allowed roles list */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean {
    const allowedRoles: string[] = route.data['roles'] || [];

    if (this.authService.hasAccess(allowedRoles)) {
      return true;
    } else {
      const dialogRef = this.dialog.open(CustomDialogComponent, {
        data: {
          title: 'Access Denied',
          message: 'You are not allowed to access this page',
        },
      });

      dialogRef.afterClosed().subscribe(() => {
        this.router.navigate(['/home']);
      });

      return false;
    }
  }
}
