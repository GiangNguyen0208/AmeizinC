import { apiRequest } from "./api-client";
import { useAuthStore } from "@/stores/auth-store";
import type {
  AuthUser,
  AuthTokens,
  LoginRequest,
  RegisterRequest,
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

// ── Email Verification ──────────────────────────────────

export async function verifyEmail(token: string): Promise<void> {
  await apiRequest("/auth/verify-email?token=" + encodeURIComponent(token));
}

export async function resendVerification(): Promise<void> {
  await apiRequest("/auth/resend-verification", { method: "POST" });
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
