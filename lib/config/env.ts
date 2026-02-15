/**
 * Environment Configuration
 * Centralized environment variable management
 */

export const env = {
  // API Configuration
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api",
  apiServerUrl: process.env.API_BASE_URL || "http://localhost:3000/api",

  // Authentication
  authSecret: process.env.NEXT_PUBLIC_AUTH_SECRET || "",
  jwtSecret: process.env.JWT_SECRET || "",

  // Environment
  nodeEnv: process.env.NODE_ENV || "development",
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",

  // App Configuration
  appName: process.env.NEXT_PUBLIC_APP_NAME || "Atovio BeyondAQI Web",
} as const;

/**
 * Validates required environment variables
 */
export function validateEnv(): void {
  const required = [
    "NEXT_PUBLIC_API_BASE_URL",
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
}
