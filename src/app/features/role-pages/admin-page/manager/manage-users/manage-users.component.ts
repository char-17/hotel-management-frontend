import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource,
} from '@angular/material/table';
import { User, UserService } from './user-service.service';
import { finalize } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCard } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { DatePipe, NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatFabButton, MatIconButton } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  standalone: true,
  styleUrls: ['./manage-users.component.css'],
  imports: [
    MatCard,
    MatTable,
    MatSort,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCellDef,
    FormsModule,
    NgIf,
    MatIcon,
    MatCell,
    MatIconButton,
    MatPaginator,
    MatProgressSpinner,
    MatHeaderRow,
    MatRow,
    MatRowDef,
    MatHeaderRowDef,
    DatePipe,
    MatTooltip,
    MatFabButton,
  ],
})
export class ManageUsersComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'username',
    'password',
    'firstName',
    'lastName',
    'email',
    'gender',
    'dateOfBirth',
    'role',
    'actions',
  ];

  dataSource = new MatTableDataSource<User>([]);
  isLoading = true;
  editingIndex: number | null = null;
  originalUser: User | null = null;
  showPassword: boolean[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService
      .getAllUsers()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (users) => {
          this.dataSource.data = users;
          this.showPassword = new Array(users.length).fill(false);
        },
        error: () => this.showError('Failed to load users'),
      });
  }

  togglePassword(index: number): void {
    this.showPassword[index] = !this.showPassword[index];
  }

  editUser(index: number): void {
    this.editingIndex = index;
    this.originalUser = { ...this.dataSource.data[index] };
  }

  saveUser(index: number): void {
    const user = this.dataSource.data[index];
    this.userService.updateUser(user).subscribe({
      next: () => {
        this.editingIndex = null;
        this.showSuccess('User updated successfully');
      },
      error: () => this.showError('Failed to update user'),
    });
  }

  cancelEdit(): void {
    if (this.originalUser && this.editingIndex !== null) {
      this.dataSource.data[this.editingIndex] = this.originalUser;
      this.dataSource._updateChangeSubscription();
    }
    this.editingIndex = null;
  }

  deleteUser(index: number): void {
    const user = this.dataSource.data[index];
    if (confirm(`Delete user ${user.username}?`)) {
      this.userService.deleteUser(user.id!).subscribe({
        next: () => {
          this.dataSource.data.splice(index, 1);
          this.dataSource._updateChangeSubscription();
          this.showPassword.splice(index, 1);
          this.showSuccess('User deleted successfully');
        },
        error: () => this.showError('Failed to delete user'),
      });
    }
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar'],
    });
  }
}
