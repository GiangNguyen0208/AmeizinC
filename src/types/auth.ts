export interface AuthUser {
  _id: string;
  email?: string;
  fullName: string;
  avatar?: string;
  phone?: string;
  dateOfBirth?: string;
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
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
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
