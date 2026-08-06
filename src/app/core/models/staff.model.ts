/* Staff model -- backend uses the User entity filtered by STAFF role */
export interface Staff {
  id?: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
}
