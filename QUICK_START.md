# 🚀 Quick Start Guide

## 📂 Simple Folder Guide

Think of the project like a house with different rooms:

```
🏠 Your Project
│
├── 📱 app/              → Pages (what users see)
│   ├── page.tsx         → Home page
│   ├── auth/            → Login & Register pages
│   └── dashboard/       → Dashboard page
│
├── 🧩 components/       → Reusable pieces (like LEGO blocks)
│   ├── ui/              → Basic blocks (Button, Input, Card)
│   └── auth/            → Auth blocks (LoginForm, etc.)
│
├── 🔧 lib/              → Tools & services (behind the scenes)
│   ├── api/             → API calls (getApi, postApi, etc.)
│   ├── auth/            → Login/logout logic
│   └── interceptors/    → HTTP request handlers
│
├── 🎣 hooks/            → Custom React hooks
├── 🛠️ utils/            → Helper functions
└── 📝 types/            → TypeScript types
```

## 🎯 Where to Put Your Code

### Adding a New Page?
→ Put it in `app/your-page/page.tsx`

### Creating a Reusable Component?
→ Put it in `components/ui/YourComponent.tsx`

### Making an API Call?
→ Use `getApi`, `postApi` from `@/lib/api`
```tsx
import { getApi, postApi } from "@/lib/api";

// GET request
const data = await getApi("/users");

// POST request
const result = await postApi("/users", { name: "John" });
```

### Adding Authentication?
→ Use `useAuth` hook
```tsx
import { useAuth } from "@/lib/auth";

const { user, login, logout } = useAuth();
```

### Need a Helper Function?
→ Add it to `utils/` folder

## 📋 Common Tasks

### 1. Create a New Page
```tsx
// app/products/page.tsx
export default function ProductsPage() {
  return <div>Products Page</div>;
}
```

### 2. Create a Reusable Component
```tsx
// components/ui/ProductCard.tsx
export function ProductCard({ title }: { title: string }) {
  return <div>{title}</div>;
}
```

### 3. Make an API Call
```tsx
// In any component or page
import { getApi } from "@/lib/api";

const products = await getApi("/products");
```

### 4. Protect a Route
```tsx
// app/protected/page.tsx
import { ProtectedRoute } from "@/components/auth";

export default function ProtectedPage() {
  return (
    <ProtectedRoute>
      <div>This page requires login</div>
    </ProtectedRoute>
  );
}
```

## 🗺️ Navigation Map

| What You Want | Where to Look |
|--------------|---------------|
| Pages/Routes | `app/` folder |
| UI Components | `components/ui/` |
| API Calls | `lib/api/api-service.ts` |
| Auth Logic | `lib/auth/` |
| Helper Functions | `utils/` |
| Custom Hooks | `hooks/` |
| Types | `types/` |

## 💡 Pro Tips

1. **Always use the API service** - Don't call APIs directly, use `getApi`, `postApi`, etc.
2. **Reuse UI components** - Check `components/ui/` before creating new ones
3. **Keep files small** - If a file gets too big, split it into smaller files
4. **Use TypeScript types** - Define types in `types/` folder

## 🎓 Learning Path

1. **Start here**: Look at `app/page.tsx` (home page)
2. **See components**: Check `components/ui/Button.tsx`
3. **Understand API**: Read `lib/api/api-service.ts`
4. **Learn auth**: Explore `lib/auth/auth-service.ts`

That's it! The structure is designed to be intuitive. 🎉
