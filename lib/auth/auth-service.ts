/**
 * Authentication Service
 * Handles authentication-related API calls
 */

import { postApi, getApi } from "@/lib/api";
import {
  setAuthToken,
  setRefreshToken,
  clearAuthToken,
} from "./token-manager";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

export interface User {
  id: string;
  email: string;
  name?: string;
}

/**
 * Login user
 */
export async function login(
  credentials: LoginCredentials
): Promise<AuthResponse> {
  try {
    const response = await postApi<AuthResponse>("/auth/login", credentials);

    if (response.token) {
      setAuthToken(response.token);
      if (response.refreshToken) {
        setRefreshToken(response.refreshToken);
      }
    }

    return response;
  } catch (error) {
    throw error;
  }
}

/**
 * Register user
 */
export async function register(data: RegisterData): Promise<AuthResponse> {
  try {
    const response = await postApi<AuthResponse>("/auth/register", data);

    if (response.token) {
      setAuthToken(response.token);
      if (response.refreshToken) {
        setRefreshToken(response.refreshToken);
      }
    }

    return response;
  } catch (error) {
    throw error;
  }
}

/**
 * Logout user
 */
export function logout(): void {
  clearAuthToken();
}

/**
 * Get current user
 */
export async function getCurrentUser(): Promise<User> {
  try {
    const response = await getApi<User>("/auth/me");
    return response;
  } catch (error) {
    throw error;
  }
}

/**
 * Refresh authentication token
 */
export async function refreshToken(): Promise<AuthResponse> {
  try {
    const response = await postApi<AuthResponse>("/auth/refresh");
    
    if (response.token) {
      setAuthToken(response.token);
      if (response.refreshToken) {
        setRefreshToken(response.refreshToken);
      }
    }

    return response;
  } catch (error) {
    clearAuthToken();
    throw error;
  }
}
