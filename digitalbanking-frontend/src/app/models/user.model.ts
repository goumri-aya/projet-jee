export interface User {
  username: string;
  roles: string[];
  active: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  password: string;
  confirmedPassword: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface JwtResponse {
  token: string;
  type: string;
  username: string;
  roles: string[];
}
