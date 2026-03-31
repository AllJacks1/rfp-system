"use client";

import Dashboard from "../components/dashboard/Dashboard";
import UserDashboard from "../components/dashboard/UserDashboard";
import { usePermissions } from "@/hooks/usePermissions";

export default function HomePage() {
  const { hasPageAccess, isLoading } = usePermissions();
  
  // Show loading state while checking permissions
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#2B3A9F]/30 border-t-[#2B3A9F]" />
          <span className="text-slate-500">Loading...</span>
        </div>
      </div>
    );
  }

  const canAccessDashboard = hasPageAccess("dashboard");

  return (
    <div>
      {canAccessDashboard ? <Dashboard /> : <UserDashboard />}
    </div>
  );
}