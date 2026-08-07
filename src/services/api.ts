import axios, { AxiosError, AxiosInstance } from "axios";

export const API_URL = (import.meta as unknown as { env: Record<string, string> }).env
  .VITE_API_URL as string | undefined;

export const api: AxiosInstance = axios.create({
  baseURL: API_URL || "",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export function setToken(token: string | null): void {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}

export function getToken(): string | null {
  return localStorage.getItem("wp_token");
}

export interface ApiError {
  success: boolean;
  message: string;
}

export function errorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const e = err as AxiosError<ApiError>;
    return e.response?.data?.message || e.message || "Something went wrong";
  }
  if (err instanceof Error) return err.message;
  return "Something went wrong";
}

api.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("wp_token");
      setToken(null);
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// convenience generic get
export async function get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const res = await api.get<{ success: boolean; data: T }>(url, { params });
  return res.data.data;
}

export async function post<T>(url: string, data?: unknown): Promise<T> {
  const res = await api.post<{ success: boolean; data: T }>(url, data);
  return res.data.data;
}

export async function put<T>(url: string, data?: unknown): Promise<T> {
  const res = await api.put<{ success: boolean; data: T }>(url, data);
  return res.data.data;
}

export async function del<T>(url: string): Promise<T> {
  const res = await api.delete<{ success: boolean; data: T }>(url);
  return res.data.data;
}