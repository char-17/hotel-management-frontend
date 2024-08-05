import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking } from '../models/booking.model';
import {environment} from "../../../environments/environment";  // Correct path

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private readonly apiUrl: string;

  constructor(private http: HttpClient, ) {
    this.apiUrl = `${environment.apiUrl}/bookings`;
  }

  getAllBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.apiUrl);
  }

  createBooking(booking: Booking): Observable<Booking> {
    return this.http.post<Booking>(this.apiUrl, booking);
  }
}
