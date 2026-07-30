/* Shared Guest interface matching the enriched backend Guest entity */
export interface Guest {
  guestID?: number;
  version?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  nationality: string;
  passportNumber: string;
  notes: string;
}
