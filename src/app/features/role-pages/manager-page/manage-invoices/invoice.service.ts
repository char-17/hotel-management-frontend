import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { Page } from '../../../../core/models/page.model';

/* Invoice model matching the backend Invoice entity */
export interface Invoice {
  invoiceId?: number;
  amount: number;
  date: string;
  paymentStatus: string;
  reservation?: { reservationId: number };
}

@Injectable({ providedIn: 'root' })
export class InvoiceService {
  /* Backend endpoint for invoices */
  private apiUrl = `${environment.apiUrl}/invoices`;

  constructor(private http: HttpClient) {}

  /* Extract content array from paginated response */
  getAll(): Observable<Invoice[]> {
    return this.http.get<Page<Invoice>>(this.apiUrl).pipe(map(page => page.content));
  }

  getById(id: number): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.apiUrl}/${id}`);
  }

  create(invoice: Invoice): Observable<Invoice> {
    return this.http.post<Invoice>(this.apiUrl, invoice);
  }

  update(id: number, invoice: Invoice): Observable<Invoice> {
    return this.http.put<Invoice>(`${this.apiUrl}/${id}`, invoice);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
