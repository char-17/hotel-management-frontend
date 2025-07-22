import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  email: string;
  gender: string;
  dateOfBirth: string;
}

export interface RegisterResponse {
  username: string;
  password: string;
  role: number;
  registrationErrorMessage: string;
  empty: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private apiUrl = `${environment.apiUrl}/register`;

  constructor(private http: HttpClient) {}

  register(data: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(this.apiUrl, data);
  }
}
