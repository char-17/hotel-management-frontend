/* Matches the backend Booking entity — user and room are nested JPA relationships */
export interface Booking {
  id?: number;
  user: { id: number };
  room: { id: number };
  checkInDate: string;
  checkOutDate: string;
}
