/* Reservation model matching the backend Reservation entity */
export interface Reservation {
  reservationId?: number;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  status: string;
  guest?: { guestID: number; firstName?: string; lastName?: string };
  room?: { id: number; roomNumber?: string };
}
