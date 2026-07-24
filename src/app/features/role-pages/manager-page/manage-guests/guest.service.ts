import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

/* Guest model matching the backend Guest entity */
export interface Guest {
  guestID?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
}

@Injectable({ providedIn: 'root' })
export class GuestService {
  /* Backend endpoint for guests */
  /* Uses centralized environment URL — now /api/guests */
  private apiUrl = `${environment.apiUrl}/guests`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Guest[]> {
    return this.http.get<Guest[]>(this.apiUrl);
  }

  create(guest: Guest): Observable<Guest> {
    return this.http.post<Guest>(`${this.apiUrl}`, guest);
  }

  update(id: number, guest: Guest): Observable<Guest> {
    return this.http.put<Guest>(`${this.apiUrl}/${id}`, guest);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
