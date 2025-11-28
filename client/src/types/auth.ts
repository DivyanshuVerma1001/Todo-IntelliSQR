export interface User {
  _id: string;
  name: string;
  email: string;
  emailId?: string;
}

export interface AuthResponse {
  user: User;
  message: string;
}

export interface ApiError {
  error?: string;
  message?: string;
}

