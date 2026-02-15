# 📂 Simple Project Structure Guide

## 🎯 The Big Picture

```
Your Project
│
├── 📱 app/              → PAGES (what users see)
├── 🧩 components/       → REUSABLE PIECES
├── 🔧 lib/              → TOOLS & SERVICES
├── 🎣 hooks/            → CUSTOM HOOKS
├── 🛠️ utils/            → HELPER FUNCTIONS
└── 📝 types/            → TYPESCRIPT TYPES
```

## 📱 App Folder = Your Pages

**Rule:** Folder = Route

```
app/
├── page.tsx              → Homepage (/)
├── about/page.tsx        → About page (/about)
└── products/page.tsx     → Products page (/products)
```

## 🧩 Components = Reusable Pieces

**Rule:** Organize by feature

```
components/
├── ui/                   → Basic building blocks
│   ├── Button.tsx
│   ├── Input.tsx
│   └── Card.tsx
│
└── products/             → Product-specific components
    ├── ProductCard.tsx
    └── ProductList.tsx
```

## 🔧 Lib = Your Tools

**Rule:** Business logic and services

```
lib/
├── api/                  → API calls (getApi, postApi)
├── auth/                 → Login/logout logic
└── config/               → Settings
```

## 🎯 Quick Decision Tree

**"Where do I put this?"**

```
Is it a page/route?
  YES → app/
  NO ↓

Is it a reusable UI component?
  YES → components/ui/
  NO ↓

Is it a feature component?
  YES → components/feature-name/
  NO ↓

Is it an API call?
  YES → Use lib/api (getApi, postApi)
  NO ↓

Is it a helper function?
  YES → utils/
  NO ↓

Is it a custom hook?
  YES → hooks/
  NO ↓

Is it a type definition?
  YES → types/
```

## 📋 Common Patterns

### Pattern 1: New Feature
```
1. Create page: app/feature/page.tsx
2. Create components: components/feature/
3. Create API calls: Use getApi/postApi from lib/api
4. Add types: types/index.ts
```

### Pattern 2: Reusable Component
```
1. Create: components/ui/MyComponent.tsx
2. Export: components/ui/index.ts
3. Use: import { MyComponent } from "@/components/ui"
```

### Pattern 3: API Integration
```
1. Use existing: import { getApi } from "@/lib/api"
2. Call: const data = await getApi("/endpoint")
3. Done! ✅
```

## 🎓 Examples

### Example 1: Blog Feature

```
app/
└── blog/
    └── page.tsx          → /blog page

components/
└── blog/
    ├── BlogPost.tsx     → Blog post component
    └── BlogList.tsx     → Blog list component

lib/
└── api/
    └── blog-service.ts  → Blog API calls (optional)
```

### Example 2: User Profile

```
app/
└── profile/
    └── page.tsx         → /profile page

components/
└── profile/
    └── ProfileCard.tsx  → Profile display component

(Use existing auth from lib/auth)
```

## ✅ Best Practices

1. **Keep it simple** - Don't over-organize
2. **Follow the pattern** - Use existing structure
3. **Reuse components** - Check `components/ui/` first
4. **Use API service** - Always use `getApi`, `postApi`, etc.
5. **Small files** - Keep files under 900 lines

## 🚀 That's It!

The structure is designed to be intuitive. When in doubt:
- **Pages** → `app/`
- **Components** → `components/`
- **API Calls** → Use `lib/api`
- **Helpers** → `utils/`

Happy coding! 🎉
