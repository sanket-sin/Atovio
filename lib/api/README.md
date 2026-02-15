# API Service Documentation

This module provides centralized API request functions for making HTTP calls throughout the application.

## Quick Start

```tsx
import { getApi, postApi, putApi, deleteApi, patchApi } from "@/lib/api";

// GET request
const users = await getApi("/users");

// POST request
const newUser = await postApi("/users", { name: "John", email: "john@example.com" });

// PUT request
const updated = await putApi("/users/123", { name: "Jane" });

// PATCH request
const patched = await patchApi("/users/123", { email: "newemail@example.com" });

// DELETE request
await deleteApi("/users/123");
```

## Available Functions

### `getApi<T>(route, config?)`
Makes a GET request to the specified route.

**Parameters:**
- `route` (string): API endpoint (e.g., `/users` or `/users/123`)
- `config` (optional): Axios request configuration

**Returns:** Promise with response data of type `T`

**Example:**
```tsx
const user = await getApi<User>("/users/123");
const users = await getApi<User[]>("/users");
```

### `postApi<T>(route, data?, config?)`
Makes a POST request to the specified route.

**Parameters:**
- `route` (string): API endpoint
- `data` (optional): Request body data
- `config` (optional): Axios request configuration

**Returns:** Promise with response data of type `T`

**Example:**
```tsx
const newUser = await postApi<User>("/users", {
  name: "John",
  email: "john@example.com"
});
```

### `putApi<T>(route, data?, config?)`
Makes a PUT request to the specified route.

**Parameters:**
- `route` (string): API endpoint
- `data` (optional): Request body data
- `config` (optional): Axios request configuration

**Returns:** Promise with response data of type `T`

**Example:**
```tsx
const updated = await putApi<User>("/users/123", {
  name: "Jane",
  email: "jane@example.com"
});
```

### `patchApi<T>(route, data?, config?)`
Makes a PATCH request to the specified route.

**Parameters:**
- `route` (string): API endpoint
- `data` (optional): Request body data
- `config` (optional): Axios request configuration

**Returns:** Promise with response data of type `T`

**Example:**
```tsx
const patched = await patchApi<User>("/users/123", {
  email: "newemail@example.com"
});
```

### `deleteApi<T>(route, config?)`
Makes a DELETE request to the specified route.

**Parameters:**
- `route` (string): API endpoint
- `config` (optional): Axios request configuration

**Returns:** Promise with response data of type `T`

**Example:**
```tsx
await deleteApi("/users/123");
```

### `getApiWithParams<T>(route, params?, config?)`
Convenience function for GET requests with query parameters.

**Parameters:**
- `route` (string): API endpoint
- `params` (optional): Query parameters object
- `config` (optional): Axios request configuration

**Returns:** Promise with response data of type `T`

**Example:**
```tsx
const users = await getApiWithParams<User[]>("/users", {
  page: 1,
  limit: 10,
  search: "john"
});
```

## Usage in React Components

```tsx
"use client";

import { useState, useEffect } from "react";
import { getApi, postApi } from "@/lib/api";

interface User {
  id: string;
  name: string;
  email: string;
}

export function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await getApi<User[]>("/users");
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const handleCreateUser = async () => {
    try {
      const newUser = await postApi<User>("/users", {
        name: "New User",
        email: "user@example.com"
      });
      setUsers([...users, newUser]);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <button onClick={handleCreateUser}>Create User</button>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

## Usage in Server Components (Next.js App Router)

```tsx
import { getApi } from "@/lib/api";

export default async function UsersPage() {
  const users = await getApi<User[]>("/users");

  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

## Error Handling

All API functions throw errors that can be caught:

```tsx
try {
  const user = await getApi<User>("/users/123");
} catch (error) {
  if (error.response?.status === 404) {
    console.error("User not found");
  } else {
    console.error("Error:", error);
  }
}
```

## Custom Configuration

You can pass custom axios configuration:

```tsx
const user = await getApi<User>("/users/123", {
  headers: {
    "Custom-Header": "value"
  },
  timeout: 5000
});
```

## Features

- ✅ Automatic authentication token injection (via interceptors)
- ✅ Request/response logging (in development)
- ✅ Error handling and token refresh
- ✅ TypeScript support with generics
- ✅ Centralized configuration
- ✅ Clean, simple API

## Notes

- All requests automatically include authentication tokens if available
- Base URL is configured in `lib/config/env.ts`
- Interceptors handle logging and error responses automatically
- Response data is automatically extracted (no need to access `.data`)
