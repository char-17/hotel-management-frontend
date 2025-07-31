import { Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  gender: string;
  role: number;
  email: string;
  dateOfBirth: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly apiUrl = `${environment.apiUrl}/get-all-users`;

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    // Используйте правильный эндпоинт вашего API
    return this.http.get<User[]>(`${this.apiUrl}`);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${user.id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
