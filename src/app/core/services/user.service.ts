import { Injectable } from '@angular/core';
/* Centralized imports from core — models and environment live alongside this service */
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';
import { Page } from '../models/page.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  /* Extract content array from paginated response */
  getAllUsers(): Observable<User[]> {
    return this.http.get<Page<User>>(this.apiUrl).pipe(map(page => page.content));
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${user.id}`, user);
  }

  /* Create a new user — POST /api/users would need a register-like endpoint;
     using /api/auth/register since UsersController has no POST */
  createUser(user: User): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/auth/register`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
