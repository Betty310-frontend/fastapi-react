export interface UserCreate {
  username: string;
  password1: string;
  password2: string;
  email: string;
}

export interface UserLogin {
  username: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
}
