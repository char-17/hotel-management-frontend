import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
/* Centralized imports from core — models and environment live alongside this service */
import { environment } from '../../../environments/environment';
import { Page } from '../models/page.model';
import { Staff } from '../models/staff.model';

@Injectable({ providedIn: 'root' })
export class StaffService {
  /* Backend endpoint for staff management */
  private apiUrl = `${environment.apiUrl}/staff`;

  constructor(private http: HttpClient) {}

  /* Extract content array from paginated response */
  getAll(): Observable<Staff[]> {
    return this.http.get<Page<Staff>>(this.apiUrl).pipe(map(page => page.content));
  }

  create(staff: Staff): Observable<Staff> {
    return this.http.post<Staff>(this.apiUrl, staff);
  }

  update(id: number, staff: Staff): Observable<Staff> {
    return this.http.put<Staff>(`${this.apiUrl}/${id}`, staff);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
