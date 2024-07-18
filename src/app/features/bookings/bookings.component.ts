import {Component, OnInit} from "@angular/core";
import { BookingService } from '../../core/services/booking.service';
import { Booking } from '../../core/models/booking.model';
import {NgForOf} from "@angular/common";
import {MatCard, MatCardContent, MatCardTitle} from "@angular/material/card";
import {FormsModule} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {MatToolbar} from "@angular/material/toolbar";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";


@Component({
  selector: "app-bookings",
  templateUrl: "./bookings.component.html",
  standalone: true,
  styleUrls: ["./bookings.component.css"],
  imports: [

    NgForOf

  ],
  providers:[]
})

  export class BookingsComponent implements OnInit {
  bookings: Booking[] = [];

  constructor (private bookingService: BookingService) {}

  ngOnInit() {
    this.getBookings();
  }

  getBookings(): void {
    this.bookingService.getAllBookings().subscribe((data: Booking[]) => {
      this.bookings = data;
    })
  }

  createBooking(booking: Booking): void {
    this.bookingService.createBooking(booking).subscribe((newBooking: Booking) => {
      this.bookings.push(newBooking);
    });
  }

}
