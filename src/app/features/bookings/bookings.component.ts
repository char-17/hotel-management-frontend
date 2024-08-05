import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../core/services/booking.service';
import { Booking } from '../../core/models/booking.model';
import { NgForOf } from '@angular/common';
import { NavToolbarComponent } from '../../shared/navbar/nav-toolbar/nav-toolbar.component';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  standalone: true,
  styleUrls: ['./bookings.component.css'],
  imports: [NgForOf, NavToolbarComponent],
  providers: [],
})
export class BookingsComponent implements OnInit {
  bookings: Booking[] = [];

  constructor(private bookingService: BookingService) {}

  ngOnInit() {
    this.getBookings();
  }

  getBookings(): void {
    this.bookingService.getAllBookings().subscribe((data: Booking[]) => {
      this.bookings = data;
    });
  }

  createBooking(booking: Booking): void {
    this.bookingService
      .createBooking(booking)
      .subscribe((newBooking: Booking) => {
        this.bookings.push(newBooking);
      });
  }
}
