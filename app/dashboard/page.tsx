"use client";

import { ProtectedRoute } from "@/components/auth";
import { useAuth } from "@/lib/auth";
import { LogoutButton } from "@/components/auth";
import { Card } from "@/components/ui";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="mx-auto w-full max-w-container">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <LogoutButton />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card title="Welcome">
              <p className="text-gray-600">
                Hello, {user?.name || user?.email || "User"}!
              </p>
              <p className="text-sm text-gray-500 mt-2">
                You are successfully logged in.
              </p>
            </Card>

            <Card title="User Information">
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Email:</span> {user?.email}
                </p>
                {user?.name && (
                  <p className="text-sm">
                    <span className="font-medium">Name:</span> {user.name}
                  </p>
                )}
                <p className="text-sm">
                  <span className="font-medium">ID:</span> {user?.id}
                </p>
              </div>
            </Card>

            <Card title="Quick Actions">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Your dashboard is ready. Start building your features here!
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
