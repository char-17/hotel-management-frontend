import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { MatIcon } from '@angular/material/icon';
import { MatCard } from '@angular/material/card';
import { MatSort } from '@angular/material/sort';
import { NgIf } from '@angular/common';
import { MatFabButton, MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
/* Imports from centralized core — service and model moved out of feature folder */
import { RoomService } from '../../../../../core/services/room.service';
import { Room } from '../../../../../core/models/room.model';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { catchError, of } from 'rxjs';
/* MatSnackBar replaces native alert() for non-blocking user feedback */
import { MatSnackBar } from '@angular/material/snack-bar';
/* MatDialog + ConfirmDialogComponent replace native confirm() for delete actions */
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-manage-rooms',
    templateUrl: './manage-rooms.component.html',
    styleUrl: './manage-rooms.component.css',
    imports: [
        ReactiveFormsModule,
        MatIcon,
        MatCard,
        MatTable,
        MatSort,
        MatColumnDef,
        MatHeaderCell,
        MatHeaderCellDef,
        MatCell,
        MatCellDef,
        NgIf,
        FormsModule,
        MatIconButton,
        MatTooltip,
        MatHeaderRow,
        MatHeaderRowDef,
        MatRow,
        MatRowDef,
        MatPaginator,
        MatProgressSpinner,
        MatFabButton,
    ]
})
export class ManageRoomsComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'roomNumber',
    'roomType',
    'capacity',
    'roomPrice',
    'roomStatus',
    'actions',
  ];

  dataSource = new MatTableDataSource<Room>();
  isLoading = true;
  editingIndex: number | null = null;
  originalRoom: Room | null = null; // Stores original data for edit cancellation
  isCreating = false; // Tracks whether we are adding a new room vs editing

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private roomService: RoomService,
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
    this.loadRooms();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadRooms(): void {
    this.isLoading = true;
    this.roomService
      .getRooms()
      .pipe(
        catchError((error) => {
          console.error('Error while loading rooms:', error);
          this.isLoading = false;
          return of([]); // Return empty array on error
        }),
      )
      .subscribe((rooms) => {
        this.dataSource.data = rooms;
        this.isLoading = false;
      });
  }

  /* Insert a blank room at the top of the table for inline creation */
  addRoom(): void {
    const newRoom: Room = {
      roomNumber: '',
      roomType: '',
      capacity: 1,
      roomPrice: 0,
      roomStatus: 'AVAILABLE',
    } as Room;
    const data = this.dataSource.data;
    data.unshift(newRoom);
    this.dataSource.data = data;
    this.editingIndex = 0;
    this.isCreating = true; // Flag so saveRoom knows to POST instead of PUT
  }

  editRoom(index: number): void {
    this.editingIndex = index;
    // Clone object so we can revert on cancel
    this.originalRoom = { ...this.dataSource.data[index] };
  }

  saveRoom(index: number): void {
    if (this.editingIndex === index) {
      const roomToSave = this.dataSource.data[index];

      /* Branch: create new room via POST, or update existing via PUT */
      if (this.isCreating) {
        this.roomService
          .createRoom(roomToSave)
          .pipe(
            catchError((error) => {
              console.error('Error creating room:', error);
              /* Material snackbar instead of native alert for error feedback */
              this.showError('Failed to create room.');
              this.cancelEdit();
              return of(null);
            }),
          )
          .subscribe((created) => {
            if (created) {
              console.log('Room created:', created);
              this.isCreating = false;
              this.editingIndex = null;
              this.loadRooms(); // Reload to get server-assigned ID
            }
          });
        return;
      }

      // Guard against missing room ID
      if (roomToSave.id === undefined) {
        console.error('Error: room ID is undefined, cannot save.', roomToSave);
        /* Material snackbar instead of native alert for error feedback */
        this.showError('Cannot save room: ID is undefined.');
        this.cancelEdit();
        return;
      }

      this.roomService
        .updateRoom(roomToSave.id, roomToSave)
        .pipe(
          catchError((error) => {
            console.error('Error saving room:', error);
            if (this.originalRoom) {
              this.dataSource.data[index] = this.originalRoom;
              this.dataSource._updateChangeSubscription();
            }
            /* Material snackbar instead of native alert for error feedback */
            this.showError('Failed to save changes.');
            this.cancelEdit();
            return of(roomToSave);
          }),
        )
        .subscribe((updatedRoom) => {
          console.log('Room updated:', updatedRoom);
          this.editingIndex = null;
          this.originalRoom = null;
        });
    }
  }

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
    if (this.editingIndex !== null && this.originalRoom) {
      this.dataSource.data[this.editingIndex] = this.originalRoom;
      this.dataSource._updateChangeSubscription(); // Refresh table view
    }
    this.editingIndex = null;
    this.originalRoom = null;
  }

  deleteRoom(index: number): void {
    const roomToDelete = this.dataSource.data[index];
    // Guard against missing room ID
    if (roomToDelete.id === undefined) {
      console.error('Error: room ID is undefined, cannot delete.', roomToDelete);
      /* Material snackbar instead of native alert for error feedback */
      this.showError('Cannot delete room: ID is undefined.');
      return;
    }

    /* Material dialog instead of native confirm() for delete confirmation */
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Confirm Delete', message: `Are you sure you want to delete room #${roomToDelete.roomNumber}?` } as ConfirmDialogData,
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        /* Non-null assertion safe — ID checked before dialog was opened */
        this.roomService
          .deleteRoom(roomToDelete.id!)
          .pipe(
            catchError((error) => {
              console.error('Error deleting room:', error);
              this.showError('Failed to delete room.');
              return of(null);
            }),
          )
          .subscribe(() => {
            console.log('Room deleted:', roomToDelete);
            this.dataSource.data.splice(index, 1);
            this.dataSource._updateChangeSubscription();
          });
      }
    });
  }
}
