/* Room entity — id is optional because new rooms don't have one yet */
export interface Room {
  id?: number;
  roomNumber: string;
  roomType: string;
  capacity: number;
  roomPrice: number;
  roomStatus: string;
}
