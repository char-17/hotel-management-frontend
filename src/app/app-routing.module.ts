import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
// import { ManageBookingsComponent } from './features/role-pages/admin-page/manager/manage-bookings/manage-bookings.component';

export const routes: Routes = [
  { path: 'bookings', component: BookingsComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  // { path: 'manage-users', component: ManageUsersComponent },
  // { path: 'manage-rooms', component: ManageRoomsComponent },
  // {
  //   path: 'dashboard/admin/manage-bookings',
  //   component: ManageBookingsComponent,
  // },
  { path: 'dashboard', component: DashboardComponent },

  {
    path: 'dashboard/admin',
    component: AdminPageComponent,
    canActivate: [AuthGuard],
    data: { role: 'admin' },
    children: [
      { path: 'manage-users', component: ManageUsersComponent },
      { path: 'manage-rooms', component: ManageRoomsComponent },
      { path: 'manage-bookings', component: ManageBookingsComponent },
    ],
  },
  {
    path: 'dashboard/manager',
    component: ManagerPageComponent,
    canActivate: [AuthGuard],
    // data: { role: 'admin' },
    data: { role: 'manager' },
  },
  // { path: '**', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
