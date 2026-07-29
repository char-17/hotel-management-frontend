import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { Page } from '../../../../core/models/page.model';

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
  private apiUrl = `${environment.apiUrl}/guests`;

  constructor(private http: HttpClient) {}

  /* Extract content array from paginated response */
  getAll(): Observable<Guest[]> {
    return this.http.get<Page<Guest>>(this.apiUrl).pipe(map(page => page.content));
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
