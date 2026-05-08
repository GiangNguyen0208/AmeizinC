export interface AuthUser {
  _id: string;
  email?: string;
  fullName: string;
  avatar?: string;
  authMethod?: "email";
  role: "user" | "admin" | "super_admin";
  isActive: boolean;
  isVerified?: boolean;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
}
