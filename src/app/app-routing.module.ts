import { Routes } from '@angular/router';
import { BookingsComponent } from './features/bookings/bookings.component';
import { RegisterComponent } from './features/register/register.component';
import { LoginComponent } from './features/login/login.component';
import { HomeComponent } from './features/home/home/home.component';
import { AdminPageComponent } from './features/role-pages/admin-page/admin-page.component';
import { ManagerPageComponent } from './features/role-pages/manager-page/manager-page.component';
import { AuthGuard } from './core/guards/auth.guard';
import { ManageUsersComponent } from './features/role-pages/admin-page/manager/manage-users/manage-users.component';
import { ManageRoomsComponent } from './features/role-pages/admin-page/manager/manage-rooms/manage-rooms.component';
import { ManageBookingsComponent } from './features/role-pages/admin-page/manager/manage-bookings/manage-bookings.component';
import { DashboardComponent } from './features/dashboard/dashboard/dashboard.component';
/* Manager sub-page imports */
import { ManageReservationsComponent } from './features/role-pages/manager-page/manage-reservations/manage-reservations.component';
import { ManageGuestsComponent } from './features/role-pages/manager-page/manage-guests/manage-guests.component';
import { ManageHousekeepingComponent } from './features/role-pages/manager-page/manage-housekeeping/manage-housekeeping.component';
import { ManageStaffComponent } from './features/role-pages/manager-page/manage-staff/manage-staff.component';
import { ManageEmployeesComponent } from './features/role-pages/manager-page/manage-employees/manage-employees.component';
import { ManageInvoicesComponent } from './features/role-pages/manager-page/manage-invoices/manage-invoices.component';
import { ManagePaymentsComponent } from './features/role-pages/manager-page/manage-payments/manage-payments.component';

export const routes: Routes = [
  { path: 'bookings', component: BookingsComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },

  /* Admin dashboard — only admin can access */
  {
    path: 'dashboard/admin',
    component: AdminPageComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin'] },
    children: [
      { path: 'manage-users', component: ManageUsersComponent },
      { path: 'manage-rooms', component: ManageRoomsComponent },
      { path: 'manage-bookings', component: ManageBookingsComponent },
    ],
  },

  /* Manager dashboard — admin and manager can access (admin is superuser) */
  {
    path: 'dashboard/manager',
    component: ManagerPageComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin', 'manager'] },
    children: [
      { path: 'manage-reservations', component: ManageReservationsComponent },
      { path: 'manage-guests', component: ManageGuestsComponent },
      { path: 'manage-housekeeping', component: ManageHousekeepingComponent },
      { path: 'manage-staff', component: ManageStaffComponent },
      { path: 'manage-employees', component: ManageEmployeesComponent },
      { path: 'manage-invoices', component: ManageInvoicesComponent },
      { path: 'manage-payments', component: ManagePaymentsComponent },
    ],
  },

  /* Catch-all: redirect unknown URLs to home instead of showing a blank page */
  { path: '**', redirectTo: '/home' },
];
