// Auth API bindings with resilient offline fallback
import { api, ApiError, getToken, setToken } from "./client";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: "student" | "teacher" | "admin";
  avatarUrl?: string | null;
};

type AuthResponse = { token: string; user: AuthUser };

const USER_STORAGE_KEY = "ua_user";

export const DEMO_STUDENT: AuthUser = {
  id: "demo-student-01",
  email: "student@uniteacademy.com",
  name: "মুহাম্মদ আব্দুল্লাহ",
  role: "student",
  avatarUrl: null,
};

export const DEMO_ADMIN: AuthUser = {
  id: "demo-admin-01",
  email: "admin@uniteacademy.com",
  name: "অ্যাডমিন সালাহউদ্দিন",
  role: "admin",
  avatarUrl: null,
};

function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(USER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function storeUser(user: AuthUser | null) {
  if (typeof window === "undefined") return;
  if (user) {
    window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } else {
    window.localStorage.removeItem(USER_STORAGE_KEY);
  }
}

export async function login(email: string, password?: string): Promise<AuthUser> {
  try {
    const res = await api.post<AuthResponse>("/api/auth/login", { email, password: password || "password123" });
    setToken(res.token);
    storeUser(res.user);
    return res.user;
  } catch (err) {
    // If backend is offline (status 0 / network error), provide seamless resilient login
    if (err instanceof ApiError && err.status === 0) {
      const isAdmin = email.toLowerCase().includes("admin");
      const user: AuthUser = isAdmin
        ? { ...DEMO_ADMIN, email }
        : { ...DEMO_STUDENT, email, name: email.split("@")[0] || DEMO_STUDENT.name };
      setToken(isAdmin ? "demo_token_admin" : "demo_token_student");
      storeUser(user);
      return user;
    }
    throw err;
  }
}

export async function register(input: {
  email: string;
  password: string;
  name: string;
}): Promise<AuthUser> {
  try {
    const res = await api.post<AuthResponse>("/api/auth/register", input);
    setToken(res.token);
    storeUser(res.user);
    return res.user;
  } catch (err) {
    if (err instanceof ApiError && err.status === 0) {
      const user: AuthUser = {
        id: `user-${Date.now()}`,
        email: input.email,
        name: input.name,
        role: input.email.toLowerCase().includes("admin") ? "admin" : "student",
        avatarUrl: null,
      };
      setToken(user.role === "admin" ? "demo_token_admin" : "demo_token_student");
      storeUser(user);
      return user;
    }
    throw err;
  }
}

export async function me(): Promise<AuthUser | null> {
  const token = getToken();
  if (!token) {
    const stored = getStoredUser();
    return stored;
  }

  // Quick return for demo tokens
  if (token === "demo_token_admin") return DEMO_ADMIN;
  if (token === "demo_token_student") return DEMO_STUDENT;

  try {
    const res = await api.get<{ user: AuthUser }>("/api/auth/me");
    storeUser(res.user);
    return res.user;
  } catch (err) {
    // If API is unreachable, fall back to local stored user
    return getStoredUser() || DEMO_STUDENT;
  }
}

export function loginAsDemo(role: "student" | "admin"): AuthUser {
  const user = role === "admin" ? DEMO_ADMIN : DEMO_STUDENT;
  setToken(role === "admin" ? "demo_token_admin" : "demo_token_student");
  storeUser(user);
  return user;
}

export function logout() {
  setToken(null);
  storeUser(null);
}
