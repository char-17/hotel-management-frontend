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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';
import { AdminPageComponent } from '../../admin-page.component';

@Component({
  selector: 'app-manage-bookings',
  templateUrl: './manage-bookings.component.html',
  styleUrls: ['./manage-bookings.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatCardModule,
    MatPaginatorModule,
    AdminPageComponent,
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
  ],
})
export class ManageBookingsComponent implements OnInit {
  bookingForm: FormGroup;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = [
    'bookingId',
    'bookingCheckInDate',
    'bookingCheckOutDate',
    'roomId',
    'userId',
    'actions',
  ];

  isLoading = false;
  pageNumber = 0;

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
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

  loadBookings() {
    const bookings = [
      {
        bookingId: 1,
        bookingCheckInDate: new Date('2024-08-01'),
        bookingCheckOutDate: new Date('2024-08-05'),
        roomId: 101,
        userId: 1001,
      },
      {
        bookingId: 2,
        bookingCheckInDate: new Date('2024-08-03'),
        bookingCheckOutDate: new Date('2024-08-07'),
        roomId: 102,
        userId: 1002,
      },
      {
        bookingId: 2,
        bookingCheckInDate: new Date('2024-08-09'),
        bookingCheckOutDate: new Date('2024-08-11'),
        roomId: 102,
        userId: 1002,
      },
      // Additional bookings
    ];

    bookings.forEach((booking) => this.addBookingRow(booking));
    this.dataSource.data = this.bookingRows.controls;
  }

  addBookingRow(booking: {
    bookingId: number;
    bookingCheckInDate: Date;
    bookingCheckOutDate: Date;
    roomId: number;
    userId: number;
  }) {
    const formattedCheckInDate = this.datePipe.transform(
      booking.bookingCheckInDate,
      'MM/dd/yyyy',
    );
    const formattedCheckOutDate = this.datePipe.transform(
      booking.bookingCheckOutDate,
      'MM/dd/yyyy',
    );

    const row: FormGroup = this.fb.group({
      bookingId: [booking.bookingId],
      bookingCheckInDate: [booking.bookingCheckInDate],
      bookingCheckOutDate: [booking.bookingCheckOutDate],
      roomId: [booking.roomId],
      userId: [booking.userId],
      isEditable: [false],
    });
    this.bookingRows.push(row);
  }

  editBooking(index: number) {
    const row = this.bookingRows.at(index);
    if (row) {
      row.get('isEditable')?.setValue(true);
    }
  }

  saveBooking(index: number) {
    const row = this.bookingRows.at(index);
    if (row) {
      row.get('isEditable')?.setValue(false);
    }
  }

  cancelEdit(index: number) {
    const row = this.bookingRows.at(index);
    if (row) {
      row.get('isEditable')?.setValue(false);
    }
  }

  deleteBooking(index: number) {
    if (this.bookingRows.length > 0) {
      this.bookingRows.removeAt(index);
      this.dataSource.data = this.bookingRows.controls;
    }
  }

  addNewBooking() {
    const newRow: FormGroup = this.fb.group({
      bookingId: [this.bookingRows.length + 1],
      bookingCheckInDate: [new Date()],
      bookingCheckOutDate: [new Date()],
      roomId: [0],
      userId: [0],
      isEditable: [true],
    });
    this.bookingRows.push(newRow);
    this.dataSource.data = this.bookingRows.controls;
  }

  get canAddNewBooking(): boolean {
    return !this.isLoading;
  }
}
