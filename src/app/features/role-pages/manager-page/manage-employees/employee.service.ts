import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { Page } from '../../../../core/models/page.model';

/* Employee model matching the backend Employee entity */
export interface Employee {
  employeeId?: number;
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  phone: string;
  salary: string;
}

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  /* Backend endpoint for employees */
  private apiUrl = `${environment.apiUrl}/employees`;

  constructor(private http: HttpClient) {}

  /* Extract content array from paginated response */
  getAll(): Observable<Employee[]> {
    return this.http.get<Page<Employee>>(this.apiUrl).pipe(map(page => page.content));
  }

  getById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`);
  }

  create(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, employee);
  }

  update(id: number, employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiUrl}/${id}`, employee);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
