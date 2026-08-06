import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CustomDialogComponent } from '../../shared/components/custom-dialog/custom-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';

/* Functional guard — replaces deprecated class-based CanActivate (Angular 15.2+) */
export const authGuard: CanActivateFn = async (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const dialog = inject(MatDialog);

  const allowedRoles: string[] = route.data['roles'] || [];

  if (authService.hasAccess(allowedRoles)) {
    return true;
  }

  /* Show access-denied dialog, then redirect to home after it closes */
  const dialogRef = dialog.open(CustomDialogComponent, {
    data: {
      title: 'Access Denied',
      message: 'You are not allowed to access this page',
    },
  });

  await firstValueFrom(dialogRef.afterClosed());
  router.navigate(['/home']);
  return false;
};
