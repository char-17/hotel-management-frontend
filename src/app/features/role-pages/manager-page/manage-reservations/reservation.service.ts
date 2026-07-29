import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { Page } from '../../../../core/models/page.model';

/* Reservation model matching the backend Reservation entity */
export interface Reservation {
  reservationId?: number;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  status: string;
  guest?: { guestID: number; firstName?: string; lastName?: string };
  room?: { id: number; roomNumber?: string };
}

@Injectable({ providedIn: 'root' })
export class ReservationService {
  /* Uses centralized environment URL */
  private apiUrl = `${environment.apiUrl}/reservations`;

  constructor(private http: HttpClient) {}

  /* Extract content array from paginated response */
  getAll(): Observable<Reservation[]> {
    return this.http.get<Page<Reservation>>(this.apiUrl).pipe(map(page => page.content));
  }

  getById(id: number): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.apiUrl}/${id}`);
  }

  create(reservation: Reservation): Observable<Reservation> {
    /* Standardized: was /create_reservation — now plain POST */
    return this.http.post<Reservation>(this.apiUrl, reservation);
  }

  update(id: number, reservation: Reservation): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.apiUrl}/${id}`, reservation);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
