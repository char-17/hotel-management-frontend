import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

/* Housekeeping model matching the backend Housekeeping entity */
export interface Housekeeping {
  houskeepingId?: number;
  taskDate: string;
  taskDescription: string;
  status: string;
  room?: { id: number; roomNumber?: string };
  employee?: { employeeId: number; firstName?: string; lastName?: string };
}

@Injectable({ providedIn: 'root' })
export class HousekeepingService {
  /* Backend endpoint for housekeeping tasks */
  /* Uses centralized environment URL — now /api/housekeeping */
  private apiUrl = `${environment.apiUrl}/housekeeping`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Housekeeping[]> {
    return this.http.get<Housekeeping[]>(this.apiUrl);
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
