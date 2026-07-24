import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

/* Staff model — backend uses the User entity filtered by STAFF role */
export interface Staff {
  id?: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class StaffService {
  /* Backend endpoint for staff management */
  /* Uses centralized environment URL */
  private apiUrl = `${environment.apiUrl}/staff`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Staff[]> {
    return this.http.get<Staff[]>(this.apiUrl);
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
