/**
 * Interceptors Index
 * Exports all interceptors and sets up the HTTP client
 */

import { httpClient } from "./http-client";
import {
  authRequestInterceptor,
  authResponseInterceptor,
  authErrorInterceptor,
} from "./auth-interceptor";
import {
  loggingRequestInterceptor,
  loggingResponseInterceptor,
  loggingErrorInterceptor,
} from "./logging-interceptor";

// Setup interceptors
httpClient.addRequestInterceptor(authRequestInterceptor);
httpClient.addRequestInterceptor(loggingRequestInterceptor);

httpClient.addResponseInterceptor(authResponseInterceptor);
httpClient.addResponseInterceptor(loggingResponseInterceptor);

httpClient.addErrorInterceptor(loggingErrorInterceptor);
httpClient.addErrorInterceptor(authErrorInterceptor);

// Export configured client
export { httpClient };
export * from "./http-client";
export * from "./auth-interceptor";
export * from "./logging-interceptor";
