/**
 * Logout Button Component
 * Handles user logout
 */

"use client";

import React from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  return (
    <Button variant="outline" onClick={handleLogout}>
      Logout
    </Button>
  );
}
