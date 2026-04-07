"use client";

import { usePermissions } from "@/hooks/usePermissions";
import Dashboard from "./Dashboard";
import UserDashboard from "./UserDashboard";
import { HomePageClientProps } from "@/lib/interfaces";

export default function HomePageClient({ moduleSummary, recentActivities }: HomePageClientProps) {
  const { hasPageAccess, isLoading } = usePermissions();
  
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
      {canAccessDashboard ? (
        <Dashboard moduleSummary={moduleSummary} recentActivities={recentActivities} />
      ) : (
        <UserDashboard />
      )}
    </div>
  );
}