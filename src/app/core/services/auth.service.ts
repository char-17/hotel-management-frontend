import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';

/* Role hierarchy: admin > manager > staff > client/guest */
const ROLE_HIERARCHY: Record<string, number> = {
  admin: 100,
  manager: 50,
  staff: 30,
  client: 10,
  guest: 5,
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl: string;
  /* Storage key for persisting user role across page refreshes */
  private static readonly ROLE_KEY = 'userRole';

  constructor(private http: HttpClient) {
    /* Auth endpoints live under /api/auth on the backend */
    this.apiUrl = `${environment.apiUrl}/auth`;
  }

  register(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, user);
  }

  /* Read role from localStorage so it survives page refreshes */
  get getUserRole(): string {
    return localStorage.getItem(AuthService.ROLE_KEY) || '';
  }

  /* Store the role in localStorage after successful login */
  set setUserRole(value: string) {
    localStorage.setItem(AuthService.ROLE_KEY, value);
  }

  /* Check if the user's role is allowed based on role hierarchy */
  hasAccess(allowedRoles: string[]): boolean {
    const userRole = this.getUserRole;
    const userLevel = ROLE_HIERARCHY[userRole] ?? 0;
    /* Grant access if the user's role is in the list OR outranks all listed roles */
    return allowedRoles.some(
      (role) => userRole === role || userLevel >= (ROLE_HIERARCHY[role] ?? 0)
    );
  }

  /* Check if the user is authenticated (has a valid token stored) */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  /* Clear auth data on logout */
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem(AuthService.ROLE_KEY);
  }
}
