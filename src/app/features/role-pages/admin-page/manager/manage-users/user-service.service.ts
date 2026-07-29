import { Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../../../../../core/models/user.model';
import { Page } from '../../../../../core/models/page.model';

/* Re-export User so existing component imports keep working */
export { User } from '../../../../../core/models/user.model';

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
