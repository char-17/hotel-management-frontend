/* Payment model matching the backend Payment entity */
export interface Payment {
  paymentId?: number;
  paymentDate: string;
  amount: number;
  paymentMethod: string;
  invoice?: { invoiceId: number };
}
