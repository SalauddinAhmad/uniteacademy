// Auth API bindings for the standalone backend.
import { api, setToken } from "./client";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: "student" | "teacher" | "admin";
  avatarUrl?: string | null;
};

type AuthResponse = { token: string; user: AuthUser };

export async function login(email: string, password: string): Promise<AuthUser> {
  const res = await api.post<AuthResponse>("/api/auth/login", { email, password });
  setToken(res.token);
  return res.user;
}

export async function register(input: {
  email: string;
  password: string;
  name: string;
}): Promise<AuthUser> {
  const res = await api.post<AuthResponse>("/api/auth/register", input);
  setToken(res.token);
  return res.user;
}

export async function me(): Promise<AuthUser | null> {
  try {
    const res = await api.get<{ user: AuthUser }>("/api/auth/me");
    return res.user;
  } catch {
    return null;
  }
}

export function logout() {
  setToken(null);
}
