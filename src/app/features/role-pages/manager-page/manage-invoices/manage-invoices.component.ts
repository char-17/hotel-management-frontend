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
import { InvoiceService } from '../../../../core/services/invoice.service';
import { Invoice } from '../../../../core/models/invoice.model';
/* MatSnackBar replaces native alert() for non-blocking user feedback */
import { MatSnackBar } from '@angular/material/snack-bar';
/* MatDialog + ConfirmDialogComponent replace native confirm() for delete actions */
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-manage-invoices',
  templateUrl: './manage-invoices.component.html',
  styleUrl: './manage-invoices.component.css',
  imports: [
    FormsModule, MatIcon, MatCard, MatTable, MatSort,
    MatColumnDef, MatHeaderCell, MatHeaderCellDef, MatCell, MatCellDef,
    NgIf, MatIconButton, MatTooltip, MatHeaderRow, MatHeaderRowDef,
    MatRow, MatRowDef, MatPaginator, MatProgressSpinner, MatFabButton,
  ]
})
export class ManageInvoicesComponent implements OnInit {
  /* Columns displayed in the invoices table */
  displayedColumns: string[] = [
    'invoiceId', 'amount', 'date', 'paymentStatus', 'actions',
  ];

  dataSource = new MatTableDataSource<Invoice>();
  isLoading = true;
  editingIndex: number | null = null;
  originalItem: Invoice | null = null;
  isCreating = false; // Tracks whether we are adding a new invoice vs editing

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private invoiceService: InvoiceService,
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

  /* Fetch all invoices from the backend */
  loadData(): void {
    this.isLoading = true;
    this.invoiceService.getAll()
      .pipe(catchError((error) => {
        console.error('Error loading invoices:', error);
        this.isLoading = false;
        return of([]);
      }))
      .subscribe((data) => {
        this.dataSource.data = data;
        this.isLoading = false;
      });
  }

  /* Insert a blank invoice at the top of the table for inline creation */
  addItem(): void {
    const newItem: Invoice = {
      amount: 0,
      date: '',
      paymentStatus: 'PENDING',
    } as Invoice;
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

    /* Branch: create new invoice via POST, or update existing via PUT */
    if (this.isCreating) {
      this.invoiceService.create(item)
        .pipe(catchError((error) => {
          console.error('Error creating invoice:', error);
          /* Material snackbar instead of native alert for error feedback */
          this.showError('Failed to create invoice.');
          this.cancelEdit();
          return of(null);
        }))
        .subscribe((created) => {
          if (created) {
            console.log('Invoice created:', created);
            this.isCreating = false;
            this.editingIndex = null;
            this.loadData(); // Reload to get server-assigned ID
          }
        });
      return;
    }

    if (item.invoiceId === undefined) {
      /* Material snackbar instead of native alert for error feedback */
      this.showError('Cannot save: invoice ID is undefined.');
      this.cancelEdit();
      return;
    }
    this.invoiceService.update(item.invoiceId, item)
      .pipe(catchError((error) => {
        console.error('Error saving invoice:', error);
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

  /* Delete an invoice after confirmation — uses Material dialog instead of native confirm() */
  deleteItem(index: number): void {
    const item = this.dataSource.data[index];
    if (item.invoiceId === undefined) {
      this.showError('Cannot delete: invoice ID is undefined.');
      return;
    }
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Confirm Delete', message: `Delete invoice #${item.invoiceId}?` } as ConfirmDialogData,
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        /* Non-null assertion safe — ID checked before dialog was opened */
        this.invoiceService.delete(item.invoiceId!)
          .pipe(catchError((error) => {
            console.error('Error deleting invoice:', error);
            this.showError('Failed to delete invoice.');
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
