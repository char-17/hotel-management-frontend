import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Booking } from '../models/booking.model';
import { Page } from '../models/page.model';
import { environment } from '../../../environments/environment';

/* Full CRUD service matching the backend BookingController endpoints */
@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private readonly apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = `${environment.apiUrl}/bookings`;
  }

  /* Extract content array from paginated response */
  getAllBookings(): Observable<Booking[]> {
    return this.http.get<Page<Booking>>(this.apiUrl).pipe(map(page => page.content));
  }

  getBookingById(id: number): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/${id}`);
  }

  createBooking(booking: Booking): Observable<Booking> {
    return this.http.post<Booking>(this.apiUrl, booking);
  }

  /* PUT update — matches backend @PutMapping("/{id}") */
  updateBooking(id: number, booking: Booking): Observable<Booking> {
    return this.http.put<Booking>(`${this.apiUrl}/${id}`, booking);
  }

  /* DELETE — matches backend @DeleteMapping("/{id}") */
  deleteBooking(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
