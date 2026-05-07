export interface AuthUser {
  _id: string;
  email?: string;
  fullName: string;
  phone?: string;
  avatar?: string;
  authMethod?: "email" | "sms" | "google";
  role: "user" | "admin" | "super_admin";
  isActive: boolean;
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

export interface SmsOtpRequest {
  phone: string;
}

export interface SmsLoginRequest {
  phone: string;
  otp: string;
}

export interface SmsRegisterRequest {
  phone: string;
  otp: string;
  fullName: string;
}

export interface GoogleAuthRequest {
  idToken: string;
}
