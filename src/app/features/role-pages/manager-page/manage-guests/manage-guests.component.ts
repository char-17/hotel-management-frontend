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
import { GuestService } from '../../../../core/services/guest.service';
import { Guest } from '../../../../core/models/guest.model';
/* MatSnackBar replaces native alert() for non-blocking user feedback */
import { MatSnackBar } from '@angular/material/snack-bar';
/* MatDialog + ConfirmDialogComponent replace native confirm() for delete actions */
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-manage-guests',
  templateUrl: './manage-guests.component.html',
  styleUrl: './manage-guests.component.css',
  imports: [
    FormsModule, MatIcon, MatCard, MatTable, MatSort,
    MatColumnDef, MatHeaderCell, MatHeaderCellDef, MatCell, MatCellDef,
    NgIf, MatIconButton, MatTooltip, MatHeaderRow, MatHeaderRowDef,
    MatRow, MatRowDef, MatPaginator, MatProgressSpinner, MatFabButton,
  ]
})
export class ManageGuestsComponent implements OnInit {
  /* Columns displayed in the guests table — includes nationality and passportNumber */
  displayedColumns: string[] = [
    'guestID', 'firstName', 'lastName', 'email', 'phone', 'nationality', 'passportNumber', 'actions',
  ];

  dataSource = new MatTableDataSource<Guest>();
  isLoading = true;
  editingIndex: number | null = null;
  originalItem: Guest | null = null;
  isCreating = false; // Tracks whether we are adding a new guest vs editing

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private guestService: GuestService,
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

  /* Fetch all guests from the backend */
  loadData(): void {
    this.isLoading = true;
    this.guestService.getAll()
      .pipe(catchError((error) => {
        console.error('Error loading guests:', error);
        this.isLoading = false;
        return of([]);
      }))
      .subscribe((data) => {
        this.dataSource.data = data;
        this.isLoading = false;
      });
  }

  /* Insert a blank guest at the top of the table for inline creation */
  addItem(): void {
    /* Blank guest object with all fields for inline creation */
    const newItem: Guest = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      dateOfBirth: '',
      nationality: '',
      passportNumber: '',
      notes: '',
    } as Guest;
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

    /* Branch: create new guest via POST, or update existing via PUT */
    if (this.isCreating) {
      this.guestService.create(item)
        .pipe(catchError((error) => {
          console.error('Error creating guest:', error);
          /* Material snackbar instead of native alert for error feedback */
          this.showError('Failed to create guest.');
          this.cancelEdit();
          return of(null);
        }))
        .subscribe((created) => {
          if (created) {
            console.log('Guest created:', created);
            this.isCreating = false;
            this.editingIndex = null;
            this.loadData(); // Reload to get server-assigned ID
          }
        });
      return;
    }

    if (item.guestID === undefined) {
      /* Material snackbar instead of native alert for error feedback */
      this.showError('Cannot save: guest ID is undefined.');
      this.cancelEdit();
      return;
    }
    this.guestService.update(item.guestID, item)
      .pipe(catchError((error) => {
        console.error('Error saving guest:', error);
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

  /* Delete a guest after confirmation — uses Material dialog instead of native confirm() */
  deleteItem(index: number): void {
    const item = this.dataSource.data[index];
    if (item.guestID === undefined) {
      this.showError('Cannot delete: guest ID is undefined.');
      return;
    }
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Confirm Delete', message: `Delete guest ${item.firstName} ${item.lastName}?` } as ConfirmDialogData,
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        /* Non-null assertion safe — ID checked before dialog was opened */
        this.guestService.delete(item.guestID!)
          .pipe(catchError((error) => {
            console.error('Error deleting guest:', error);
            this.showError('Failed to delete guest.');
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
