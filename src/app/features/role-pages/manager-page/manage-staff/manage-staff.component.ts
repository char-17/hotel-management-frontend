import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatCell, MatCellDef, MatColumnDef, MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatTable, MatTableDataSource,
} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatIcon } from '@angular/material/icon';
import { MatCard } from '@angular/material/card';
import { MatFabButton, MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';
import { catchError, of } from 'rxjs';
/* Imports from centralized core — service and model moved out of feature folder */
import { StaffService } from '../../../../core/services/staff.service';
import { Staff } from '../../../../core/models/staff.model';
/* MatSnackBar replaces native alert() for non-blocking user feedback */
import { MatSnackBar } from '@angular/material/snack-bar';
/* MatDialog + ConfirmDialogComponent replace native confirm() for delete actions */
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-manage-staff',
  templateUrl: './manage-staff.component.html',
  styleUrl: './manage-staff.component.css',
  imports: [
    FormsModule, MatIcon, MatCard, MatTable, MatSort,
    MatColumnDef, MatHeaderCell, MatHeaderCellDef, MatCell, MatCellDef,
    NgIf, MatIconButton, MatTooltip, MatHeaderRow, MatHeaderRowDef,
    MatRow, MatRowDef, MatPaginator, MatProgressSpinner, MatFabButton,
  ]
})
export class ManageStaffComponent implements OnInit {
  /* Columns displayed in the staff table */
  displayedColumns: string[] = [
    'id', 'firstName', 'lastName', 'username', 'email', 'actions',
  ];

  dataSource = new MatTableDataSource<Staff>();
  isLoading = true;
  editingIndex: number | null = null;
  originalItem: Staff | null = null;
  isCreating = false; // Tracks whether we are adding a new staff member vs editing

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private staffService: StaffService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {}

  /* Reusable snackbar helpers — replace native alert() with Material snackbar */
  private showSuccess(msg: string): void {
    this.snackBar.open(msg, 'Close', { duration: 3000 });
  }
  private showError(msg: string): void {
    this.snackBar.open(msg, 'Close', { duration: 5000, panelClass: ['error-snackbar'] });
  }

  ngOnInit() {
    this.loadData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /* Fetch all staff members from the backend */
  loadData(): void {
    this.isLoading = true;
    this.staffService.getAll()
      .pipe(catchError((error) => {
        console.error('Error loading staff:', error);
        this.isLoading = false;
        return of([]);
      }))
      .subscribe((data) => {
        this.dataSource.data = data;
        this.isLoading = false;
      });
  }

  /* Insert a blank staff member at the top of the table for inline creation */
  addItem(): void {
    const newItem: Staff = {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
    } as Staff;
    const data = this.dataSource.data;
    data.unshift(newItem);
    this.dataSource.data = data;
    this.editingIndex = 0;
    this.isCreating = true; // Flag so saveItem knows to POST instead of PUT
  }

  /* Enter edit mode for a row */
  editItem(index: number): void {
    this.editingIndex = index;
    this.originalItem = { ...this.dataSource.data[index] };
  }

  /* Save the edited row to the backend */
  saveItem(index: number): void {
    const item = this.dataSource.data[index];

    /* Branch: create new staff member via POST, or update existing via PUT */
    if (this.isCreating) {
      this.staffService.create(item)
        .pipe(catchError((error) => {
          console.error('Error creating staff:', error);
          /* Material snackbar instead of native alert for error feedback */
          this.showError('Failed to create staff member.');
          this.cancelEdit();
          return of(null);
        }))
        .subscribe((created) => {
          if (created) {
            console.log('Staff created:', created);
            this.isCreating = false;
            this.editingIndex = null;
            this.loadData(); // Reload to get server-assigned ID
          }
        });
      return;
    }

    if (item.id === undefined) {
      /* Material snackbar instead of native alert for error feedback */
      this.showError('Cannot save: staff ID is undefined.');
      this.cancelEdit();
      return;
    }
    this.staffService.update(item.id, item)
      .pipe(catchError((error) => {
        console.error('Error saving staff:', error);
        if (this.originalItem) {
          this.dataSource.data[index] = this.originalItem;
          this.dataSource._updateChangeSubscription();
        }
        /* Material snackbar instead of native alert for error feedback */
        this.showError('Failed to save changes.');
        this.cancelEdit();
        return of(item);
      }))
      .subscribe(() => {
        this.editingIndex = null;
        this.originalItem = null;
      });
  }

  /* Revert changes and exit edit mode */
  cancelEdit(): void {
    /* If we were creating, remove the unsaved blank row */
    if (this.isCreating) {
      const data = this.dataSource.data;
      data.splice(0, 1);
      this.dataSource.data = data;
      this.isCreating = false;
      this.editingIndex = null;
      return;
    }
    if (this.editingIndex !== null && this.originalItem) {
      this.dataSource.data[this.editingIndex] = this.originalItem;
      this.dataSource._updateChangeSubscription();
    }
    this.editingIndex = null;
    this.originalItem = null;
  }

  /* Delete a staff member after confirmation — uses Material dialog instead of native confirm() */
  deleteItem(index: number): void {
    const item = this.dataSource.data[index];
    if (item.id === undefined) {
      this.showError('Cannot delete: staff ID is undefined.');
      return;
    }
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Confirm Delete', message: `Delete staff member ${item.firstName} ${item.lastName}?` } as ConfirmDialogData,
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        /* Non-null assertion safe — ID checked before dialog was opened */
        this.staffService.delete(item.id!)
          .pipe(catchError((error) => {
            console.error('Error deleting staff:', error);
            this.showError('Failed to delete staff member.');
            return of(null);
          }))
          .subscribe(() => {
            this.dataSource.data.splice(index, 1);
            this.dataSource._updateChangeSubscription();
          });
      }
    });
  }
}
