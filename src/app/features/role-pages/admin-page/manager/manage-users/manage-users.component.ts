import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
import { MatPaginator } from '@angular/material/paginator';
import { MatCard } from '@angular/material/card';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatFormField, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { AdminPageComponent } from '../../admin-page.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css'],
  standalone: true,
  imports: [
    MatCard,
    MatProgressSpinner,
    MatPaginator,
    MatHeaderRow,
    MatRow,
    MatHeaderRowDef,
    MatRowDef,
    MatIcon,
    MatIconButton,
    MatTooltip,
    ReactiveFormsModule,
    MatCellDef,
    MatCell,
    MatHeaderCellDef,
    MatHeaderCell,
    MatColumnDef,
    MatFormField,
    MatInput,
    MatTable,
    AdminPageComponent,
    NgIf,
    MatButton,
    MatSuffix,
    // Include the necessary Angular Material and other modules here
  ],
})
export class ManageUsersComponent implements OnInit {
  userForm: FormGroup;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'username', 'password', 'actions'];
  isLoading = false;
  canAddNewUser: boolean = true;
  showPassword: boolean[] = []; // Track password visibility for each row

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      userRows: this.fb.array([]),
    });
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.loadUsers();
  }

  // Getter to access the FormArray
  get userRows(): FormArray {
    return this.userForm.get('userRows') as FormArray;
  }

  loadUsers() {
    const users = [
      { id: '1', username: 'user1', password: 'pass1' },
      { id: '2', username: 'user2', password: 'pass2' },
      { id: '3232', username: 'user2', password: 'pass2' },
      // More users can be added here
    ];

    users.forEach((user) => this.addUserRow(user));
    this.updateDataSource();
  }

  addUserRow(user: { id: string; username: string; password: string }) {
    const row = this.fb.group({
      id: [user.id, Validators.required],
      username: [user.username, Validators.required],
      password: [user.password, Validators.required],
      isEditable: [false],
    });
    this.userRows.push(row);
    this.showPassword.push(false); // Initialize password visibility to false
    this.updateDataSource();
  }

  getNextId(): string {
    const currentIds = this.userRows.controls.map((control) =>
      parseInt(control.get('id')?.value || '0', 10),
    );
    return (Math.max(...currentIds) + 1).toString();
  }

  addNewUser() {
    if (this.canAddNewUser) {
      const newUser = {
        id: this.getNextId(),
        username: '',
        password: '',
        isEditable: true,
      };
      this.addUserRow(newUser);
      this.canAddNewUser = false; // Disable adding a new user until the current one is filled
    }
  }

  editUser(index: number) {
    const row = this.userRows.at(index) as FormGroup;
    if (row) {
      row.get('isEditable')?.setValue(true);
    }
  }

  saveUser(index: number) {
    const row = this.userRows.at(index) as FormGroup;
    if (row && this.isRowValid(row)) {
      row.get('isEditable')?.setValue(false);
      this.canAddNewUser = true; // Re-enable adding a new user after saving
    } else {
      alert('Please fill in all fields before saving.');
    }
  }

  cancelEdit(index: number) {
    const row = this.userRows.at(index) as FormGroup;
    if (row) {
      row.get('isEditable')?.setValue(false);
      this.canAddNewUser = true; // Re-enable adding a new user after canceling
    }
  }

  deleteUser(index: number) {
    if (this.userRows.length > 0) {
      this.userRows.removeAt(index);
      this.showPassword.splice(index, 1); // Remove password visibility tracking for deleted row
      this.updateDataSource();
      this.canAddNewUser = true; // Re-enable adding a new user after deletion
    }
  }

  isRowValid(row: FormGroup): boolean {
    return (
      row.get('id')?.value &&
      row.get('username')?.value &&
      row.get('password')?.value
    );
  }

  updateDataSource() {
    this.dataSource.data = this.userRows.controls.map(
      (control) => control.value,
    );
  }

  togglePasswordVisibility(index: number): void {
    this.showPassword[index] = !this.showPassword[index];
  }
}
