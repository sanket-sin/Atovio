/**
 * API Service
 * Centralized API request functions for all HTTP methods
 * Import and use: getApi, postApi, putApi, deleteApi, patchApi
 */

import { httpClient } from "@/lib/interceptors";
import { AxiosRequestConfig, AxiosResponse } from "axios";

/**
 * Generic API response type
 */
export type ApiResponse<T = any> = AxiosResponse<T>;

/**
 * GET request
 * @param route - API endpoint route (e.g., '/users' or '/users/123')
 * @param config - Optional axios request configuration
 * @returns Promise with API response data
 */
export async function getApi<T = any>(
  route: string,
  config?: AxiosRequestConfig
): Promise<T> {
  try {
    const response = await httpClient.get<T>(route, config);
    return response.data;
  } catch (error) {
    throw error;
  }
}

/**
 * POST request
 * @param route - API endpoint route (e.g., '/users')
 * @param data - Request body data
 * @param config - Optional axios request configuration
 * @returns Promise with API response data
 */
export async function postApi<T = any>(
  route: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> {
  try {
    const response = await httpClient.post<T>(route, data, config);
    return response.data;
  } catch (error) {
    throw error;
  }
}

/**
 * PUT request
 * @param route - API endpoint route (e.g., '/users/123')
 * @param data - Request body data
 * @param config - Optional axios request configuration
 * @returns Promise with API response data
 */
export async function putApi<T = any>(
  route: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> {
  try {
    const response = await httpClient.put<T>(route, data, config);
    return response.data;
  } catch (error) {
    throw error;
  }
}

/**
 * PATCH request
 * @param route - API endpoint route (e.g., '/users/123')
 * @param data - Request body data
 * @param config - Optional axios request configuration
 * @returns Promise with API response data
 */
export async function patchApi<T = any>(
  route: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> {
  try {
    const response = await httpClient.patch<T>(route, data, config);
    return response.data;
  } catch (error) {
    throw error;
  }
}

/**
 * DELETE request
 * @param route - API endpoint route (e.g., '/users/123')
 * @param config - Optional axios request configuration
 * @returns Promise with API response data
 */
export async function deleteApi<T = any>(
  route: string,
  config?: AxiosRequestConfig
): Promise<T> {
  try {
    const response = await httpClient.delete<T>(route, config);
    return response.data;
  } catch (error) {
    throw error;
  }
}

/**
 * GET request with query parameters
 * Convenience function for GET requests with query params
 * @param route - API endpoint route
 * @param params - Query parameters object
 * @param config - Optional axios request configuration
 * @returns Promise with API response data
 */
export async function getApiWithParams<T = any>(
  route: string,
  params?: Record<string, any>,
  config?: AxiosRequestConfig
): Promise<T> {
  try {
    const response = await httpClient.get<T>(route, {
      ...config,
      params,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}
