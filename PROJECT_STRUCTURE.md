# Project Structure Overview

This document provides a detailed overview of the project structure and file organization.

## File Size Compliance

✅ **All files are under 900 lines** - The largest file is `lib/interceptors/http-client.ts` with 180 lines.

## Directory Structure

```
atovio-beyondaqi-web/
│
├── app/                                    # Next.js App Router
│   ├── auth/
│   │   ├── login/
│   │   │   └── page.tsx                   # Login page (16 lines)
│   │   └── register/
│   │       └── page.tsx                   # Register page (16 lines)
│   ├── dashboard/
│   │   └── page.tsx                       # Dashboard page (58 lines)
│   ├── globals.css                        # Global styles (27 lines)
│   ├── layout.tsx                         # Root layout (25 lines)
│   └── page.tsx                           # Home page (14 lines)
│
├── components/                             # React Components
│   ├── auth/                              # Authentication Components
│   │   ├── LoginForm.tsx                  # Login form (78 lines)
│   │   ├── RegisterForm.tsx               # Register form (110 lines)
│   │   ├── ProtectedRoute.tsx             # Route protection (40 lines)
│   │   ├── LogoutButton.tsx               # Logout button (27 lines)
│   │   └── index.ts                       # Barrel export (9 lines)
│   ├── ui/                                # Reusable UI Components
│   │   ├── Button.tsx                     # Button component (78 lines)
│   │   ├── Input.tsx                      # Input component (54 lines)
│   │   ├── Card.tsx                       # Card component (33 lines)
│   │   ├── Loading.tsx                    # Loading spinner (46 lines)
│   │   └── index.ts                       # Barrel export (9 lines)
│   └── index.ts                           # Components export (7 lines)
│
├── lib/                                    # Core Libraries
│   ├── auth/                              # Authentication Module
│   │   ├── auth-context.tsx               # Auth context (101 lines)
│   │   ├── auth-service.ts                # Auth API service (126 lines)
│   │   ├── token-manager.ts               # Token utilities (92 lines)
│   │   └── index.ts                       # Barrel export (8 lines)
│   ├── config/                            # Configuration
│   │   └── env.ts                         # Environment config (39 lines)
│   └── interceptors/                      # HTTP Interceptors
│       ├── http-client.ts                 # HTTP client (180 lines)
│       ├── auth-interceptor.ts            # Auth interceptor (51 lines)
│       ├── logging-interceptor.ts         # Logging interceptor (60 lines)
│       └── index.ts                       # Interceptors setup (32 lines)
│
├── hooks/                                  # Custom React Hooks
│   ├── useDebounce.ts                     # Debounce hook (22 lines)
│   ├── useLocalStorage.ts                 # LocalStorage hook (56 lines)
│   └── index.ts                           # Hooks export (7 lines)
│
├── types/                                  # TypeScript Types
│   └── index.ts                           # Type definitions (31 lines)
│
├── utils/                                  # Utility Functions
│   ├── format.ts                          # Formatting utilities (49 lines)
│   ├── validation.ts                      # Validation utilities (67 lines)
│   ├── helpers.ts                         # Helper functions (58 lines)
│   └── index.ts                           # Utils export (8 lines)
│
├── .env.example                           # Environment template
├── .gitignore                             # Git ignore rules
├── .eslintrc.json                         # ESLint configuration
├── next.config.js                         # Next.js config (10 lines)
├── next-env.d.ts                          # Next.js types
├── package.json                           # Dependencies (28 lines)
├── postcss.config.js                      # PostCSS config (6 lines)
├── tailwind.config.ts                     # Tailwind config (19 lines)
├── tsconfig.json                          # TypeScript config (27 lines)
├── README.md                              # Project documentation (316 lines)
└── PROJECT_STRUCTURE.md                   # This file
```

## Key Features

### 1. Modular Architecture
- **Separation of Concerns**: Each module has a specific responsibility
- **Barrel Exports**: Clean imports via index files
- **Reusable Components**: UI components designed for reuse

### 2. Authentication System
- **Token Management**: Secure token storage and retrieval
- **Auth Context**: Global authentication state
- **Protected Routes**: Route-level authentication
- **Interceptors**: Automatic token injection

### 3. HTTP Client
- **Centralized Client**: Single axios instance
- **Request Interceptors**: Auth, logging
- **Response Interceptors**: Logging, transformation
- **Error Handling**: Centralized error management

### 4. Type Safety
- **TypeScript**: Full type coverage
- **Type Definitions**: Centralized in `types/`
- **Strict Mode**: Enabled for better type checking

### 5. Code Organization
- **File Size Limit**: All files < 900 lines ✅
- **Focused Components**: Single responsibility principle
- **Utility Functions**: Organized by functionality

## Import Patterns

### Components
```tsx
import { Button, Input, Card } from "@/components/ui";
import { LoginForm, ProtectedRoute } from "@/components/auth";
```

### Utilities
```tsx
import { formatDate, isValidEmail } from "@/utils";
import { useDebounce, useLocalStorage } from "@/hooks";
```

### Auth
```tsx
import { useAuth } from "@/lib/auth";
import { httpClient } from "@/lib/interceptors";
```

### Config
```tsx
import { env } from "@/lib/config/env";
```

## Best Practices Implemented

1. ✅ **No file exceeds 900 lines**
2. ✅ **Reusable components** in `components/ui/`
3. ✅ **Separated auth components** in `components/auth/`
4. ✅ **HTTP interceptors** for request/response handling
5. ✅ **Environment configuration** with validation
6. ✅ **Type safety** throughout the project
7. ✅ **Modular structure** with clear separation
8. ✅ **Barrel exports** for clean imports

## Next Steps

1. Install dependencies: `npm install`
2. Set up environment variables: Copy `.env.example` to `.env.local`
3. Start development: `npm run dev`
4. Build features using the established patterns
