# App Folder

This is where all your pages live! Next.js uses this folder for routing.

## 📁 Structure

```
app/
├── page.tsx          → Home page (/)
├── layout.tsx         → Root layout (wraps all pages)
├── auth/
│   ├── login/        → Login page (/auth/login)
│   └── register/     → Register page (/auth/register)
└── dashboard/        → Dashboard page (/dashboard)
```

## 🗺️ How Routing Works

The folder structure = URL structure:

| Folder Path | URL |
|------------|-----|
| `app/page.tsx` | `/` |
| `app/auth/login/page.tsx` | `/auth/login` |
| `app/dashboard/page.tsx` | `/dashboard` |

## 📄 Creating a New Page

1. Create a folder: `app/products/`
2. Add `page.tsx` inside:
```tsx
// app/products/page.tsx
export default function ProductsPage() {
  return <div>Products Page</div>;
}
```
3. Visit: `http://localhost:3000/products`

## 🎨 Layout

`layout.tsx` wraps all pages. It includes:
- AuthProvider (for authentication)
- ServiceWorkerProvider (for PWA)
- Global styles

## 💡 Tips

- Each folder needs a `page.tsx` to be a route
- Use `layout.tsx` in folders to wrap specific routes
- Server components by default (add `"use client"` for client components)
