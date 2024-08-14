import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavToolbarComponent } from './shared/navbar/nav-toolbar/nav-toolbar.component';
import { LoginComponent } from './features/login/login.component';
import { RegisterComponent } from './features/register/register.component';
import { BookingsComponent } from './features/bookings/bookings.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptor/auth.interceptor';
import { AdminPageComponent } from './features/role-pages/admin-page/admin-page.component';
import { ManagerPageComponent } from './features/role-pages/manager-page/manager-page.component';
import { CustomDialogComponent } from './shared/components/custom-dialog/custom-dialog.component';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogModule,
  MatDialogTitle,
} from '@angular/material/dialog';
import { AuthGuard } from './core/guards/auth.guard';
import { AuthService } from './core/services/auth.service';
import { MatTooltip } from '@angular/material/tooltip';
import { ManageUsersComponent } from './features/role-pages/admin-page/manager/manage-users/manage-users.component';
import { ManageRoomsComponent } from './features/role-pages/admin-page/manager/manage-rooms/manage-rooms.component';
import { ManageBookingsComponent } from './features/role-pages/admin-page/manager/manage-bookings/manage-bookings.component';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatNoDataRow,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatPaginator } from '@angular/material/paginator';

// Define the root module of the application
@NgModule({
  // Declarations array specifies the components, directives, and pipes that belong to this module
  declarations: [],
  // Imports array specifies the external modules that this module depends on
  imports: [
    AppComponent, // Main application component
    BrowserModule, // Provides services that are essential to launch and run a browser app
    BrowserAnimationsModule,
    AppRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    NavToolbarComponent,
    LoginComponent,
    RegisterComponent,
    BookingsComponent,
    AdminPageComponent,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatDialogModule,
    CustomDialogComponent,
    MatTooltip,
    ManagerPageComponent,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatHeaderCellDef,
    MatCellDef,
    MatProgressSpinner,
    MatPaginator,
    MatNoDataRow,
    MatHeaderRow,
    MatRow,
    MatHeaderRowDef,
    MatRowDef,
    ManageUsersComponent,
    ManageRoomsComponent,
    ManageBookingsComponent,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    AuthService,
    AuthGuard,
  ],
  bootstrap: [],
})
export class AppModule {}
