// lib/api/client.ts
import axios, { AxiosError, AxiosRequestConfig } from "axios";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "";

export class ApiError extends Error {
  constructor(
    public status: number, // HTTP status code (0 represents network/timeout error)
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Pre-configured Axios instance.
 * You can attach interceptors here later for auth tokens, logging, etc.
 */
export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  signal?: AbortSignal;
  timeoutMs?: number;
};

/**
 * Universal JSON request wrapper using Axios with timeout support and structured error handling.
 * Fully compatible with existing function signature and error handling.
 */
export async function apiRequest<T>(
  path: string,
  opts: RequestOptions = {}
): Promise<T> {
  const config: AxiosRequestConfig = {
    url: path,
    method: opts.method ?? "GET",
    data: opts.body,
    signal: opts.signal,
  };

  if (opts.timeoutMs !== undefined) {
    config.timeout = opts.timeoutMs;
  }

  try {
    const response = await apiClient.request<T>(config);
    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const axiosError = err as AxiosError<{ message?: string | string[]; error?: string }>;
      const status = axiosError.response?.status ?? 0;
      const resData = axiosError.response?.data;

      let message = axiosError.message;
      if (resData && typeof resData === "object" && "message" in resData) {
        const errorMsg = resData.message;
        message = Array.isArray(errorMsg) ? errorMsg.join("\n") : String(errorMsg);
      } else if (axiosError.code === "ECONNABORTED" || axiosError.name === "CanceledError") {
        message = "Request timed out or was cancelled.";
      }

      throw new ApiError(status, message, resData);
    }

    if (err instanceof ApiError) {
      throw err;
    }

    const message = err instanceof Error ? err.message : "Network error occurred";
    throw new ApiError(0, message, err);
  }
}
