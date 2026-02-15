/**
 * Logging Interceptor
 * Logs requests and responses for debugging
 */

import { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { env } from "@/lib/config/env";

/**
 * Request interceptor for logging
 */
export function loggingRequestInterceptor(
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig {
  if (env.isDevelopment) {
    console.log(`[HTTP Request] ${config.method?.toUpperCase()} ${config.url}`, {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data,
    });
  }

  return config;
}

/**
 * Response interceptor for logging
 */
export function loggingResponseInterceptor(
  response: AxiosResponse
): AxiosResponse {
  if (env.isDevelopment) {
    console.log(`[HTTP Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    });
  }

  return response;
}

/**
 * Error interceptor for logging
 */
export async function loggingErrorInterceptor(
  error: AxiosError
): Promise<AxiosError> {
  if (env.isDevelopment) {
    console.error(`[HTTP Error] ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
    });
  }

  return Promise.reject(error);
}
