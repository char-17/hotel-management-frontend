import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { Page } from '../../../../core/models/page.model';

/* Payment model matching the backend Payment entity */
export interface Payment {
  paymentId?: number;
  paymentDate: string;
  amount: number;
  paymentMethod: string;
  invoice?: { invoiceId: number };
}

@Injectable({ providedIn: 'root' })
export class PaymentService {
  /* Backend endpoint for payments */
  private apiUrl = `${environment.apiUrl}/payments`;

  constructor(private http: HttpClient) {}

  /* Extract content array from paginated response */
  getAll(): Observable<Payment[]> {
    return this.http.get<Page<Payment>>(this.apiUrl).pipe(map(page => page.content));
  }

  getById(id: number): Observable<Payment> {
    return this.http.get<Payment>(`${this.apiUrl}/${id}`);
  }

  create(payment: Payment): Observable<Payment> {
    return this.http.post<Payment>(this.apiUrl, payment);
  }

  update(id: number, payment: Payment): Observable<Payment> {
    return this.http.put<Payment>(`${this.apiUrl}/${id}`, payment);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
