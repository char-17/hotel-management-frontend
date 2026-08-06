import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
/* Centralized imports from core — models and environment live alongside this service */
import { environment } from '../../../environments/environment';
import { Page } from '../models/page.model';
import { Guest } from '../models/guest.model';

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
