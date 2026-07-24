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
import { Reservation, ReservationService } from './reservation.service';

@Component({
  selector: 'app-manage-reservations',
  templateUrl: './manage-reservations.component.html',
  styleUrl: './manage-reservations.component.css',
  imports: [
    FormsModule, MatIcon, MatCard, MatTable, MatSort,
    MatColumnDef, MatHeaderCell, MatHeaderCellDef, MatCell, MatCellDef,
    NgIf, MatIconButton, MatTooltip, MatHeaderRow, MatHeaderRowDef,
    MatRow, MatRowDef, MatPaginator, MatProgressSpinner, MatFabButton,
  ]
})
export class ManageReservationsComponent implements OnInit {
  /* Columns displayed in the reservations table */
  displayedColumns: string[] = [
    'reservationId', 'checkInDate', 'checkOutDate', 'numberOfGuests',
    'status', 'actions',
  ];

  dataSource = new MatTableDataSource<Reservation>();
  isLoading = true;
  editingIndex: number | null = null;
  originalItem: Reservation | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private reservationService: ReservationService) {}

  ngOnInit() {
    this.loadData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /* Fetch all reservations from the backend */
  loadData(): void {
    this.isLoading = true;
    this.reservationService.getAll()
      .pipe(catchError((error) => {
        console.error('Error loading reservations:', error);
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
    if (item.reservationId === undefined) {
      alert('Cannot save: reservation ID is undefined.');
      this.cancelEdit();
      return;
    }
    this.reservationService.update(item.reservationId, item)
      .pipe(catchError((error) => {
        console.error('Error saving reservation:', error);
        /* Revert changes on failure */
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

  /* Delete a reservation after confirmation */
  deleteItem(index: number): void {
    const item = this.dataSource.data[index];
    if (item.reservationId === undefined) {
      alert('Cannot delete: reservation ID is undefined.');
      return;
    }
    if (confirm(`Delete reservation #${item.reservationId}?`)) {
      this.reservationService.delete(item.reservationId)
        .pipe(catchError((error) => {
          console.error('Error deleting reservation:', error);
          alert('Failed to delete reservation.');
          return of(null);
        }))
        .subscribe(() => {
          this.dataSource.data.splice(index, 1);
          this.dataSource._updateChangeSubscription();
        });
    }
  }
}
