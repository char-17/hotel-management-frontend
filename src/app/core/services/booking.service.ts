import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking } from '../models/booking.model';  // Correct path
import { AppConfigService } from '../../config/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl: string;

  constructor(private http: HttpClient, private configService: AppConfigService) {
    this.apiUrl = `${configService.apiUrl}/bookings`;
  }

  getAllBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.apiUrl);
  }

  createBooking(booking: Booking): Observable<Booking> {
    return this.http.post<Booking>(this.apiUrl, booking);
  }
}
