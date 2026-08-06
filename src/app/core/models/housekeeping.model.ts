/* Housekeeping model matching the backend Housekeeping entity */
export interface Housekeeping {
  houskeepingId?: number;
  taskDate: string;
  taskDescription: string;
  status: string;
  room?: { id: number; roomNumber?: string };
  employee?: { employeeId: number; firstName?: string; lastName?: string };
}
