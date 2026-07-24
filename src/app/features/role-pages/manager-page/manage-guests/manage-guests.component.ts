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
import { Guest, GuestService } from './guest.service';

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
  /* Columns displayed in the guests table */
  displayedColumns: string[] = [
    'guestID', 'firstName', 'lastName', 'email', 'phone', 'address', 'dateOfBirth', 'actions',
  ];

  dataSource = new MatTableDataSource<Guest>();
  isLoading = true;
  editingIndex: number | null = null;
  originalItem: Guest | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private guestService: GuestService) {}

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

  /* Enter edit mode for a row */
  editItem(index: number): void {
    this.editingIndex = index;
    this.originalItem = { ...this.dataSource.data[index] };
  }

  /* Save the edited row to the backend */
  saveItem(index: number): void {
    const item = this.dataSource.data[index];
    if (item.guestID === undefined) {
      alert('Cannot save: guest ID is undefined.');
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
        alert('Failed to save changes.');
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
    if (this.editingIndex !== null && this.originalItem) {
      this.dataSource.data[this.editingIndex] = this.originalItem;
      this.dataSource._updateChangeSubscription();
    }
    this.editingIndex = null;
    this.originalItem = null;
  }

  /* Delete a guest after confirmation */
  deleteItem(index: number): void {
    const item = this.dataSource.data[index];
    if (item.guestID === undefined) {
      alert('Cannot delete: guest ID is undefined.');
      return;
    }
    if (confirm(`Delete guest ${item.firstName} ${item.lastName}?`)) {
      this.guestService.delete(item.guestID)
        .pipe(catchError((error) => {
          console.error('Error deleting guest:', error);
          alert('Failed to delete guest.');
          return of(null);
        }))
        .subscribe(() => {
          this.dataSource.data.splice(index, 1);
          this.dataSource._updateChangeSubscription();
        });
    }
  }
}
