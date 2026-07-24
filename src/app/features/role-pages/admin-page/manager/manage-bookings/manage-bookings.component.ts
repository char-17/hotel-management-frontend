import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { BookingService } from '../../../../../core/services/booking.service';
import { Booking } from '../../../../../core/models/booking.model';

@Component({
    selector: 'app-manage-bookings',
    templateUrl: './manage-bookings.component.html',
    styleUrls: ['./manage-bookings.component.css'],
    imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        MatTooltipModule,
        MatCardModule,
        MatTable,
        MatColumnDef,
        MatHeaderCell,
        MatHeaderCellDef,
        MatCell,
        MatCellDef,
        MatHeaderRow,
        MatRow,
        MatHeaderRowDef,
        MatRowDef,
    ]
})
export class ManageBookingsComponent implements OnInit {
  bookingForm: FormGroup;
  dataSource: MatTableDataSource<any>;
  /* Column keys matching the backend Booking entity fields */
  displayedColumns: string[] = [
    'id',
    'checkInDate',
    'checkOutDate',
    'roomId',
    'userId',
    'actions',
  ];

  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
  ) {
    this.bookingForm = this.fb.group({
      bookingRows: this.fb.array([]),
    });
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.loadBookings();
  }

  get bookingRows() {
    return this.bookingForm.get('bookingRows') as FormArray;
  }

  /* Fetch bookings from the real API instead of hardcoded data */
  loadBookings(): void {
    this.isLoading = true;
    this.bookingService.getAllBookings().subscribe({
      next: (bookings) => {
        this.bookingRows.clear();
        bookings.forEach((b) => this.addBookingRow(b));
        this.dataSource.data = this.bookingRows.controls;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  /* Map the nested backend response (user.id, room.id) to flat form fields */
  addBookingRow(booking: Booking): void {
    const row = this.fb.group({
      id: [booking.id],
      checkInDate: [booking.checkInDate],
      checkOutDate: [booking.checkOutDate],
      roomId: [booking.room?.id],
      userId: [booking.user?.id],
      isEditable: [false],
      isNew: [false],
    });
    this.bookingRows.push(row);
  }

  editBooking(index: number): void {
    const row = this.bookingRows.at(index);
    if (row) row.get('isEditable')?.setValue(true);
  }

  /* Persist changes via the API — create for new rows, update for existing */
  saveBooking(index: number): void {
    const row = this.bookingRows.at(index);
    if (!row) return;

    const val = row.value;
    /* Reconstruct the nested structure the backend expects */
    const booking: Booking = {
      user: { id: val.userId },
      room: { id: val.roomId },
      checkInDate: val.checkInDate,
      checkOutDate: val.checkOutDate,
    };

    if (val.isNew) {
      this.bookingService.createBooking(booking).subscribe({
        next: () => this.loadBookings(),
      });
    } else {
      this.bookingService.updateBooking(val.id, booking).subscribe({
        next: () => {
          row.get('isEditable')?.setValue(false);
        },
      });
    }
  }

  /* Cancel edit — remove unsaved new rows, revert existing rows */
  cancelEdit(index: number): void {
    const row = this.bookingRows.at(index);
    if (row?.value.isNew) {
      this.bookingRows.removeAt(index);
      this.dataSource.data = this.bookingRows.controls;
    } else if (row) {
      row.get('isEditable')?.setValue(false);
      /* Reload to discard unsaved changes */
      this.loadBookings();
    }
  }

  /* Delete via API, then refresh the list */
  deleteBooking(index: number): void {
    const row = this.bookingRows.at(index);
    if (!row) return;

    const id = row.value.id;
    if (id && !row.value.isNew) {
      this.bookingService.deleteBooking(id).subscribe({
        next: () => this.loadBookings(),
      });
    } else {
      this.bookingRows.removeAt(index);
      this.dataSource.data = this.bookingRows.controls;
    }
  }

  addNewBooking(): void {
    const newRow = this.fb.group({
      id: [null],
      checkInDate: [''],
      checkOutDate: [''],
      roomId: [null],
      userId: [null],
      isEditable: [true],
      isNew: [true],
    });
    this.bookingRows.push(newRow);
    this.dataSource.data = this.bookingRows.controls;
  }

  get canAddNewBooking(): boolean {
    return !this.isLoading;
  }
}
