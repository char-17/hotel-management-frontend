import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User } from '../models/user.model'; // Correct path
import { environment } from '../../../environments/environment';
import { UserAuthResponse } from '../models/user-auth-response.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = `${environment.apiUrl}`;
  }

  register(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, user);
  }

  login(credentials: {
    email: string;
    password: string;
  }): Observable<UserAuthResponse> {
    return this.http
      .post<UserAuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap((response) => {
          //save jwt token or maybe some other user information too
          localStorage.setItem('authToken', response.token);
          // localStorage.setItem('userName', response.user.username);
        }),
      );
  }

  private _role: string = 'admin';

  get getUserRole(): string {
    return this._role;
  }

  set setUserRole(value: string) {
    this._role = value;
  }
}
