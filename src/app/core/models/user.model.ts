/* Canonical User interface — matches the backend User entity. All other files import from here. */
export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  username: string;
  password?: string;
  gender: string;
  role: number;
  email: string;
  dateOfBirth: string;
}
