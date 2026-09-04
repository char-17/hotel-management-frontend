import { Injectable } from '@angular/core';
/* Centralized imports from core — models and environment live alongside this service */
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';
import { Page } from '../models/page.model';
import { CrudService } from './crud.service';

@Injectable({ providedIn: 'root' })
export class UserService implements CrudService<User> {
  private readonly apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  /* Standard CRUD methods — conform to CrudService<User> interface */
  getAll(): Observable<User[]> {
    return this.http.get<Page<User>>(this.apiUrl).pipe(map(page => page.content));
  }

  /* Create a new user — POST to /api/auth/register since UsersController has no POST */
  create(user: User): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/auth/register`, user);
  }

  update(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
