/* Centralized role-to-dashboard mapping — used by login and dashboard redirect logic */
export const ROLE_DASHBOARD: Record<string, string> = {
  admin: '/dashboard/admin',
  manager: '/dashboard/manager',
};
