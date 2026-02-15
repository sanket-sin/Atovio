/**
 * API Service Usage Examples
 * This file demonstrates how to use the API service functions
 * You can delete this file - it's just for reference
 */

import { getApi, postApi, putApi, patchApi, deleteApi, getApiWithParams } from "@/lib/api";

// Example: GET request
export async function fetchUsers() {
  try {
    const users = await getApi<User[]>("/users");
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

// Example: GET request with query parameters
export async function fetchUsersWithPagination(page: number, limit: number) {
  try {
    const users = await getApiWithParams<User[]>("/users", {
      page,
      limit,
    });
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

// Example: GET request with custom config
export async function fetchUserById(id: string) {
  try {
    const user = await getApi<User>(`/users/${id}`, {
      headers: {
        "Custom-Header": "value",
      },
    });
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}

// Example: POST request
export async function createUser(userData: CreateUserData) {
  try {
    const newUser = await postApi<User>("/users", userData);
    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

// Example: PUT request (full update)
export async function updateUser(id: string, userData: UpdateUserData) {
  try {
    const updatedUser = await putApi<User>(`/users/${id}`, userData);
    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

// Example: PATCH request (partial update)
export async function patchUser(id: string, partialData: Partial<User>) {
  try {
    const updatedUser = await patchApi<User>(`/users/${id}`, partialData);
    return updatedUser;
  } catch (error) {
    console.error("Error patching user:", error);
    throw error;
  }
}

// Example: DELETE request
export async function deleteUser(id: string) {
  try {
    await deleteApi(`/users/${id}`);
    return true;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}

// Example: Using in a React component
/*
import { useState, useEffect } from "react";
import { getApi } from "@/lib/api";

function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await getApi("/users");
        setUsers(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  if (loading) return <div>Loading...</div>;
  return <div>{/* render users */}</div>;
}
*/

// Type definitions for examples
interface User {
  id: string;
  name: string;
  email: string;
}

interface CreateUserData {
  name: string;
  email: string;
}

interface UpdateUserData {
  name?: string;
  email?: string;
}
