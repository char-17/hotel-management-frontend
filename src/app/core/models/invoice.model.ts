/* Invoice model matching the backend Invoice entity */
export interface Invoice {
  invoiceId?: number;
  amount: number;
  date: string;
  paymentStatus: string;
  reservation?: { reservationId: number };
}
