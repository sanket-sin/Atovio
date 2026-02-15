/**
 * Authentication Interceptor
 * Handles authentication tokens in requests and responses
 */

import { InternalAxiosRequestConfig, AxiosError, AxiosResponse } from "axios";
import { getAuthToken, clearAuthToken } from "@/lib/auth/token-manager";

/**
 * Request interceptor to add auth token
 */
export function authRequestInterceptor(
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig {
  const token = getAuthToken();

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}

/**
 * Response interceptor to handle auth errors
 */
export function authResponseInterceptor(
  response: AxiosResponse
): AxiosResponse {
  // Handle successful responses if needed
  return response;
}

/**
 * Error interceptor to handle auth errors
 */
export async function authErrorInterceptor(
  error: AxiosError
): Promise<AxiosError> {
  if (error.response?.status === 401) {
    // Unauthorized - clear token and redirect to login
    clearAuthToken();
    
    // Only redirect on client side
    if (typeof window !== "undefined") {
      window.location.href = "/auth/login";
    }
  }

  return Promise.reject(error);
}
