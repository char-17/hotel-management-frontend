/* Dashboard statistics — matches the backend DashboardStatsDTO */
export interface DashboardStats {
  totalRooms: number;
  availableRooms: number;
  occupiedRooms: number;
  dirtyRooms: number;
  occupancyRate: number;
  todayCheckIns: number;
  todayCheckOuts: number;
  activeReservations: number;
  pendingReservations: number;
  totalRevenue: number;
  pendingPayments: number;
}
