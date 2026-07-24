/* Login response from backend — includes JWT token for authenticating subsequent requests */
export interface LoginResponse {
  username: string;
  loginStatus: boolean;
  role: string;
  token: string;
}
