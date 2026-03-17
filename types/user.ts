export type UserRole = "admin" | "manager";

export interface AuthUser {
  id: number;
  fullName: string;
  login: string;
  role: UserRole;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: AuthUser;
}
export interface UserItem {
  id: number;
  fullName: string;
  login: string;
  role: "admin" | "manager";
  createdAt?: string;
  updatedAt?: string;
}