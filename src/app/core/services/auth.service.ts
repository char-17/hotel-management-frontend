import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';  // Correct path
import { AppConfigService } from '../../config/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl: string;

  constructor(private http: HttpClient, private configService: AppConfigService) {
    this.apiUrl = `${configService.apiUrl}/auth`;
  }

  register(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, user);
  }

  login(user: User): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/login`, user);
  }
}
