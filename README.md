# Atovio BeyondAQI Web

A well-structured Next.js application with TypeScript, authentication, interceptors, and reusable components.

> 📖 **New to the project?** Start with [QUICK_START.md](./QUICK_START.md) for a simple guide!
> 
> 🗺️ **Need a visual guide?** Check [STRUCTURE_SIMPLE.md](./STRUCTURE_SIMPLE.md) for an easy-to-understand structure overview!

## 🚀 Features

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Progressive Web App (PWA)** with offline support and installable
- **Authentication System** with context and protected routes
- **HTTP Interceptors** for request/response handling
- **Reusable UI Components** (Button, Input, Card, Loading)
- **Structured Folder Architecture** with modular code organization
- **Environment Configuration** with validation
- **Custom Hooks** for common functionality
- **Utility Functions** for formatting, validation, and helpers
- **Centralized API Service** for all HTTP requests

## 📁 Project Structure

```
atovio-beyondaqi-web/
├── app/                          # Next.js App Router
│   ├── auth/                     # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/                # Protected dashboard page
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout with AuthProvider
│   ├── manifest.ts               # PWA manifest
│   └── page.tsx                  # Home page
├── public/                       # Static assets
│   ├── icons/                    # PWA icons (various sizes)
│   ├── manifest.json             # PWA manifest
│   └── sw.js                     # Service worker
│
├── components/                    # React components
│   ├── auth/                     # Authentication components
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── LogoutButton.tsx
│   │   └── index.ts
│   ├── pwa/                      # PWA components
│   │   ├── ServiceWorkerProvider.tsx # Service worker & install prompt
│   │   └── index.ts
│   ├── ui/                       # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Loading.tsx
│   │   └── index.ts
│   └── index.ts                  # Components barrel export
│
├── lib/                          # Core libraries and utilities
│   ├── api/                      # API service functions
│   │   ├── api-service.ts       # Centralized API methods
│   │   └── index.ts
│   ├── auth/                     # Authentication logic
│   │   ├── auth-context.tsx     # Auth context provider
│   │   ├── auth-service.ts      # Auth API calls
│   │   ├── token-manager.ts     # Token storage utilities
│   │   └── index.ts
│   ├── config/                   # Configuration
│   │   └── env.ts               # Environment variables
│   ├── interceptors/             # HTTP interceptors
│   │   ├── http-client.ts       # Axios client with interceptors
│   │   ├── auth-interceptor.ts  # Auth token interceptor
│   │   ├── logging-interceptor.ts # Request/response logging
│   │   └── index.ts             # Interceptors setup
│   └── pwa/                      # PWA utilities
│       ├── service-worker-register.ts # Service worker registration
│       └── index.ts
│
├── hooks/                        # Custom React hooks
│   ├── useDebounce.ts
│   ├── useLocalStorage.ts
│   └── index.ts
│
├── types/                        # TypeScript type definitions
│   └── index.ts
│
├── utils/                        # Utility functions
│   ├── format.ts                # Date, currency, number formatting
│   ├── validation.ts            # Validation functions
│   ├── helpers.ts               # Helper utilities
│   └── index.ts
│
├── .env.example                  # Environment variables template
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.ts
└── tsconfig.json
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd atovio-beyondaqi-web
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
JWT_SECRET=your-jwt-secret-here
NEXT_PUBLIC_AUTH_SECRET=your-secret-key-here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Code Organization Principles

### File Size Limit
- **No file exceeds 900 lines** - Code is kept in manageable chunks
- Large components are split into smaller, focused components
- Utilities are organized by functionality

### Component Structure
- **Reusable Components**: All UI components in `components/ui/` are designed for reuse
- **Feature Components**: Feature-specific components in their respective folders
- **Barrel Exports**: Each folder has an `index.ts` for clean imports

### Authentication
- **Token Management**: Centralized in `lib/auth/token-manager.ts`
- **Auth Context**: Global state management via React Context
- **Protected Routes**: HOC component for route protection
- **Interceptors**: Automatic token injection and error handling

### HTTP Client
- **Centralized Client**: Single axios instance with interceptors
- **Request Interceptors**: Auth token injection, logging
- **Response Interceptors**: Response logging, data transformation
- **Error Interceptors**: Error handling, token refresh, redirects

## 🔐 Authentication

The app includes a complete authentication system:

- **Login**: `/auth/login`
- **Register**: `/auth/register`
- **Dashboard**: `/dashboard` (protected route)

### Using Auth Context

```tsx
import { useAuth } from "@/lib/auth";

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  // Use auth state and methods
}
```

### Protecting Routes

```tsx
import { ProtectedRoute } from "@/components/auth";

export default function Page() {
  return (
    <ProtectedRoute>
      <YourContent />
    </ProtectedRoute>
  );
}
```

## 🌐 HTTP Client Usage

```tsx
import { httpClient } from "@/lib/interceptors";

// GET request
const response = await httpClient.get("/users");

// POST request
const response = await httpClient.post("/users", { name: "John" });

// With custom config
const response = await httpClient.get("/users", {
  params: { page: 1, limit: 10 }
});
```

## 🎨 UI Components

### Button
```tsx
import { Button } from "@/components/ui";

<Button variant="primary" size="md" isLoading={false}>
  Click Me
</Button>
```

### Input
```tsx
import { Input } from "@/components/ui";

<Input
  label="Email"
  type="email"
  error={errors.email}
  placeholder="Enter your email"
/>
```

### Card
```tsx
import { Card } from "@/components/ui";

<Card title="Card Title" footer={<Button>Action</Button>}>
  Card content
</Card>
```

## 🧪 Custom Hooks

### useDebounce
```tsx
import { useDebounce } from "@/hooks";

const debouncedValue = useDebounce(searchTerm, 500);
```

### useLocalStorage
```tsx
import { useLocalStorage } from "@/hooks";

const [value, setValue] = useLocalStorage("key", "default");
```

## 🛠️ Utilities

### Formatting
```tsx
import { formatDate, formatCurrency, formatNumber } from "@/utils";

formatDate(new Date());
formatCurrency(1000);
formatNumber(1234567);
```

### Validation
```tsx
import { isValidEmail, isValidPassword } from "@/utils";

isValidEmail("user@example.com");
isValidPassword("SecurePass123!");
```

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🔧 Configuration

### TypeScript
- Strict mode enabled
- Path aliases configured (`@/*`)

### Tailwind CSS
- Configured with custom theme
- Dark mode support

### ESLint
- Next.js recommended rules
- TypeScript support

## 📄 Environment Variables

See `.env.example` for all available environment variables. Key variables:

- `NEXT_PUBLIC_API_BASE_URL` - API base URL
- `JWT_SECRET` - JWT secret key
- `NEXT_PUBLIC_AUTH_SECRET` - Auth secret key
- `NODE_ENV` - Environment (development/production)

## 📱 Progressive Web App (PWA)

This application is configured as a Progressive Web App with the following features:

### PWA Features

- ✅ **Installable**: Users can install the app on their devices
- ✅ **Offline Support**: Service worker caches assets for offline access
- ✅ **App-like Experience**: Standalone display mode
- ✅ **Fast Loading**: Cached resources load instantly
- ✅ **Install Prompt**: Automatic install prompt for supported browsers

### Installing the App

1. **Desktop (Chrome/Edge)**:
   - Visit the site
   - Click the install icon in the address bar
   - Or use the install prompt that appears

2. **Mobile (Android)**:
   - Visit the site in Chrome
   - Tap the menu (3 dots)
   - Select "Add to Home Screen" or "Install App"

3. **Mobile (iOS)**:
   - Visit the site in Safari
   - Tap the Share button
   - Select "Add to Home Screen"

### PWA Configuration

- **Manifest**: `app/manifest.ts` and `public/manifest.json`
- **Service Worker**: `public/sw.js`
- **Icons**: `public/icons/` (various sizes)
- **Registration**: Automatic via `ServiceWorkerProvider` component

### Adding App Icons

Replace the placeholder icons in `public/icons/` with your actual app icons:

1. Create icons in these sizes: 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512
2. Use tools like:
   - [RealFaviconGenerator](https://realfavicongenerator.net/)
   - [PWA Builder](https://www.pwabuilder.com/imageGenerator)
3. Place PNG files in `public/icons/` directory

### Testing PWA

1. Build the app: `npm run build`
2. Start production server: `npm run start`
3. Open in Chrome DevTools
4. Go to Application tab → Service Workers
5. Check "Offline" to test offline functionality

## 🎯 Best Practices

1. **Component Organization**: Keep components focused and under 900 lines
2. **Type Safety**: Use TypeScript types and interfaces
3. **Error Handling**: Use interceptors for centralized error handling
4. **Code Reusability**: Extract common logic into hooks and utilities
5. **Environment Variables**: Use `lib/config/env.ts` for centralized config
6. **Barrel Exports**: Use index files for clean imports
7. **PWA Icons**: Replace placeholder icons before production deployment

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)
- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

## 📝 License

This project is private and proprietary.

---

Built with ❤️ using Next.js and TypeScript
