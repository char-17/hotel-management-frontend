//User interface
interface User{
  id: number;
  username: string
  password:string
  role:number
  email:string
}

// API response type
export interface UserAuthResponse{
  token: string;
  user:User;
}
