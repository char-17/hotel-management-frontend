import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

/* All routes use lazy loading (loadComponent) for optimal bundle splitting */
export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./features/register/register.component').then(m => m.RegisterComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard/dashboard.component').then(m => m.DashboardComponent),
  },

  /* Admin dashboard — only admin can access */
  {
    path: 'dashboard/admin',
    loadComponent: () => import('./features/role-pages/admin-page/admin-page.component').then(m => m.AdminPageComponent),
    canActivate: [authGuard],
    data: { roles: ['admin'] },
    children: [
      {
        path: 'manage-users',
        loadComponent: () => import('./features/role-pages/admin-page/manager/manage-users/manage-users.component').then(m => m.ManageUsersComponent),
      },
      {
        path: 'manage-rooms',
        loadComponent: () => import('./features/role-pages/admin-page/manager/manage-rooms/manage-rooms.component').then(m => m.ManageRoomsComponent),
      },
    ],
  },

  /* Manager dashboard — admin and manager can access (admin is superuser) */
  {
    path: 'dashboard/manager',
    loadComponent: () => import('./features/role-pages/manager-page/manager-page.component').then(m => m.ManagerPageComponent),
    canActivate: [authGuard],
    data: { roles: ['admin', 'manager'] },
    children: [
      {
        path: 'manage-reservations',
        loadComponent: () => import('./features/role-pages/manager-page/manage-reservations/manage-reservations.component').then(m => m.ManageReservationsComponent),
      },
      {
        path: 'manage-guests',
        loadComponent: () => import('./features/role-pages/manager-page/manage-guests/manage-guests.component').then(m => m.ManageGuestsComponent),
      },
      {
        path: 'manage-housekeeping',
        loadComponent: () => import('./features/role-pages/manager-page/manage-housekeeping/manage-housekeeping.component').then(m => m.ManageHousekeepingComponent),
      },
      {
        path: 'manage-staff',
        loadComponent: () => import('./features/role-pages/manager-page/manage-staff/manage-staff.component').then(m => m.ManageStaffComponent),
      },
      {
        path: 'manage-employees',
        loadComponent: () => import('./features/role-pages/manager-page/manage-employees/manage-employees.component').then(m => m.ManageEmployeesComponent),
      },
      {
        path: 'manage-invoices',
        loadComponent: () => import('./features/role-pages/manager-page/manage-invoices/manage-invoices.component').then(m => m.ManageInvoicesComponent),
      },
      {
        path: 'manage-payments',
        loadComponent: () => import('./features/role-pages/manager-page/manage-payments/manage-payments.component').then(m => m.ManagePaymentsComponent),
      },
    ],
  },

  /* Catch-all: redirect unknown URLs to home */
  { path: '**', redirectTo: '/home' },
];
