import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
/* Centralized imports from core — models and environment live alongside this service */
import { environment } from '../../../environments/environment';
import { Page } from '../models/page.model';
import { Housekeeping } from '../models/housekeeping.model';

@Injectable({ providedIn: 'root' })
export class HousekeepingService {
  /* Backend endpoint for housekeeping tasks */
  private apiUrl = `${environment.apiUrl}/housekeeping`;

  constructor(private http: HttpClient) {}

  /* Extract content array from paginated response */
  getAll(): Observable<Housekeeping[]> {
    return this.http.get<Page<Housekeeping>>(this.apiUrl).pipe(map(page => page.content));
  }

  getById(id: number): Observable<Housekeeping> {
    return this.http.get<Housekeeping>(`${this.apiUrl}/${id}`);
  }

  create(task: Housekeeping): Observable<Housekeeping> {
    return this.http.post<Housekeeping>(this.apiUrl, task);
  }

  update(id: number, task: Housekeeping): Observable<Housekeeping> {
    return this.http.put<Housekeeping>(`${this.apiUrl}/${id}`, task);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
