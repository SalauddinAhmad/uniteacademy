// REST API client for the standalone Node.js/Express backend (apps/api).
// Uses JWT stored in localStorage. Base URL from VITE_API_URL env.

function resolveApiUrl(): string {
  const envUrl = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "");
  if (envUrl) return envUrl;
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    const isLocal = host === "localhost" || host === "127.0.0.1" || host.startsWith("192.168.");
    if (!isLocal) return ""; // In hosted production (e.g. Vercel), route /api through current origin
  }
  return "http://localhost:4000";
}

const API_URL = resolveApiUrl();

const TOKEN_KEY = "ua_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  data: unknown;
  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

type Options = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
  auth?: boolean; // default true when a token exists
};

export async function apiFetch<T = unknown>(
  path: string,
  opts: Options = {},
): Promise<T> {
  const url = `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(opts.headers || {}),
  };

  if (opts.body !== undefined && !(opts.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const token = getToken();
  if (token && opts.auth !== false) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(url, {
      method: opts.method || "GET",
      headers,
      body:
        opts.body === undefined
          ? undefined
          : opts.body instanceof FormData
          ? opts.body
          : JSON.stringify(opts.body),
    });
  } catch (err) {
    throw new ApiError(0, "Network error — API unreachable", err);
  }

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await res.json().catch(() => null) : await res.text();

  if (!res.ok) {
    const message =
      (isJson && payload && typeof payload === "object" && "error" in payload
        ? String((payload as { error: unknown }).error)
        : null) ||
      (typeof payload === "string" && payload) ||
      `Request failed (${res.status})`;
    throw new ApiError(res.status, message, payload);
  }

  return payload as T;
}

export const api = {
  get: <T = unknown>(path: string, opts?: Omit<Options, "method" | "body">) =>
    apiFetch<T>(path, { ...opts, method: "GET" }),
  post: <T = unknown>(path: string, body?: unknown, opts?: Omit<Options, "method" | "body">) =>
    apiFetch<T>(path, { ...opts, method: "POST", body }),
  put: <T = unknown>(path: string, body?: unknown, opts?: Omit<Options, "method" | "body">) =>
    apiFetch<T>(path, { ...opts, method: "PUT", body }),
  patch: <T = unknown>(path: string, body?: unknown, opts?: Omit<Options, "method" | "body">) =>
    apiFetch<T>(path, { ...opts, method: "PATCH", body }),
  delete: <T = unknown>(path: string, opts?: Omit<Options, "method" | "body">) =>
    apiFetch<T>(path, { ...opts, method: "DELETE" }),
};

export { API_URL };
