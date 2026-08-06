/* Employee model matching the backend Employee entity */
export interface Employee {
  employeeId?: number;
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  phone: string;
  salary: string;
}
