import { apiRequest } from "./api-client";
import { useAuthStore } from "@/stores/auth-store";
import type {
  AuthUser,
  AuthTokens,
  LoginRequest,
  RegisterRequest,
  SmsLoginRequest,
  SmsRegisterRequest,
  GoogleAuthRequest,
} from "@/types";

interface AuthResult {
  tokens: AuthTokens;
  user: AuthUser;
  isNewUser: boolean;
}

// ── Email ────────────────────────────────────────────────

export async function login(data: LoginRequest): Promise<AuthUser> {
  const result = await apiRequest<AuthResult>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
  useAuthStore.getState().setAuth(result.user, result.tokens);
  return result.user;
}

export async function register(data: RegisterRequest): Promise<AuthUser> {
  const result = await apiRequest<AuthResult>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
  useAuthStore.getState().setAuth(result.user, result.tokens);
  return result.user;
}

// ── SMS / OTP ────────────────────────────────────────────

export async function sendSmsOtp(phone: string): Promise<void> {
  await apiRequest("/auth/sms/send-otp", {
    method: "POST",
    body: JSON.stringify({ phone }),
  });
}

export async function loginWithSms(data: SmsLoginRequest): Promise<AuthUser> {
  const result = await apiRequest<AuthResult>("/auth/sms/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
  useAuthStore.getState().setAuth(result.user, result.tokens);
  return result.user;
}

export async function registerWithSms(
  data: SmsRegisterRequest
): Promise<AuthUser> {
  const result = await apiRequest<AuthResult>("/auth/sms/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
  useAuthStore.getState().setAuth(result.user, result.tokens);
  return result.user;
}

// ── Google ───────────────────────────────────────────────

export async function authenticateWithGoogle(
  data: GoogleAuthRequest
): Promise<AuthUser> {
  const result = await apiRequest<AuthResult>("/auth/google", {
    method: "POST",
    body: JSON.stringify(data),
  });
  useAuthStore.getState().setAuth(result.user, result.tokens);
  return result.user;
}

// ── Shared ───────────────────────────────────────────────

export async function fetchProfile(): Promise<AuthUser> {
  const { user } = await apiRequest<{ user: AuthUser }>("/auth/me");
  useAuthStore.getState().setUser(user);
  return user;
}

export function logout() {
  useAuthStore.getState().logout();
}
