# Components Folder

This folder contains all React components organized by feature.

## 📁 Structure

```
components/
├── ui/              → Reusable UI components (Button, Input, Card, etc.)
├── auth/            → Authentication-related components
└── pwa/             → PWA-related components
```

## 🎨 UI Components (`ui/`)

Basic, reusable components that can be used anywhere:
- `Button` - Button with variants (primary, secondary, etc.)
- `Input` - Form input with label and error states
- `Card` - Container card component
- `Loading` - Loading spinner

**Usage:**
```tsx
import { Button, Input, Card } from "@/components/ui";
```

## 🔐 Auth Components (`auth/`)

Components related to authentication:
- `LoginForm` - Login form component
- `RegisterForm` - Registration form
- `ProtectedRoute` - Wrapper for protected pages
- `LogoutButton` - Logout button component

**Usage:**
```tsx
import { LoginForm, ProtectedRoute } from "@/components/auth";
```

## 📱 PWA Components (`pwa/`)

Progressive Web App components:
- `ServiceWorkerProvider` - Handles service worker and install prompt

## 💡 Creating New Components

1. **UI Component** → Add to `components/ui/`
2. **Feature Component** → Create new folder in `components/`
3. **Always export** → Add to `index.ts` for easy imports

**Example:**
```tsx
// components/ui/MyComponent.tsx
export function MyComponent() {
  return <div>My Component</div>;
}

// components/ui/index.ts
export * from "./MyComponent";
```
