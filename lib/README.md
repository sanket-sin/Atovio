# Lib Folder

Core libraries and business logic. This is where the "magic" happens behind the scenes.

## 📁 Structure

```
lib/
├── api/              → API service functions (getApi, postApi, etc.)
├── auth/             → Authentication logic
├── config/           → Configuration (environment variables)
├── interceptors/     → HTTP request/response interceptors
└── pwa/              → PWA utilities
```

## 🌐 API Service (`api/`)

**Main file:** `api-service.ts`

Simple functions to make API calls:
- `getApi(route)` - GET request
- `postApi(route, data)` - POST request
- `putApi(route, data)` - PUT request
- `patchApi(route, data)` - PATCH request
- `deleteApi(route)` - DELETE request

**Usage:**
```tsx
import { getApi, postApi } from "@/lib/api";

// GET
const users = await getApi("/users");

// POST
const newUser = await postApi("/users", { name: "John" });
```

## 🔐 Auth (`auth/`)

Authentication-related logic:
- `auth-service.ts` - API calls for login/register
- `auth-context.tsx` - React context for auth state
- `token-manager.ts` - Token storage utilities

**Usage:**
```tsx
import { useAuth } from "@/lib/auth";

const { user, login, logout } = useAuth();
```

## ⚙️ Config (`config/`)

Configuration and environment variables:
- `env.ts` - Centralized environment variable access

**Usage:**
```tsx
import { env } from "@/lib/config/env";

const apiUrl = env.apiBaseUrl;
```

## 🔄 Interceptors (`interceptors/`)

HTTP request/response handlers:
- `http-client.ts` - Main HTTP client
- `auth-interceptor.ts` - Adds auth tokens automatically
- `logging-interceptor.ts` - Logs requests/responses

**Note:** You usually don't need to use these directly. Use `@/lib/api` instead.

## 📱 PWA (`pwa/`)

Progressive Web App utilities:
- `service-worker-register.ts` - Service worker registration

## 💡 When to Add New Files

- **API endpoints** → Add functions to `lib/api/api-service.ts` or create new service file
- **Business logic** → Create new folder in `lib/`
- **Configuration** → Add to `lib/config/`
