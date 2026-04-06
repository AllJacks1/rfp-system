"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface UserPermissions {
  permitted_pages: string[];
  permitted_sections: string[];
  permitted_subsections: string[];
  permitted_actions: string[];
}

interface UserProfile {
  user_id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
}

interface UserCache {
  profile: UserProfile;
  permissions: UserPermissions;
}

interface UsePermissionsReturn {
  permissions: UserPermissions | null;
  isLoading: boolean;
  hasPageAccess: (pageId: string) => boolean;
  hasSectionAccess: (sectionId: string) => boolean;
  hasSubsectionAccess: (subsectionId: string) => boolean;
  hasAction: (actionId: string) => boolean;
  refreshPermissions: () => Promise<void>;
  clearPermissions: () => void;
}

export function usePermissions(): UsePermissionsReturn {
  const supabase = createClient();

  const [permissions, setPermissions] = useState<UserPermissions | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const cached = localStorage.getItem("userCache") || sessionStorage.getItem("userCache");
      if (cached) {
        const parsed: UserCache = JSON.parse(cached);
        return parsed.permissions;
      }
    } catch (error) {
      console.error("Error parsing permissions cache:", error);
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(false);

  const hasPageAccess = useCallback((id: string) => permissions?.permitted_pages.includes(id) ?? false, [permissions]);
  const hasSectionAccess = useCallback((id: string) => permissions?.permitted_sections.includes(id) ?? false, [permissions]);
  const hasSubsectionAccess = useCallback((id: string) => permissions?.permitted_subsections.includes(id) ?? false, [permissions]);
  const hasAction = useCallback((id: string) => permissions?.permitted_actions.includes(id) ?? false, [permissions]);

  const refreshPermissions = useCallback(async () => {
    if (typeof window === "undefined") return;
    setIsLoading(true);

    try {
      const cached = localStorage.getItem("userCache") || sessionStorage.getItem("userCache");
      if (!cached) return;

      const parsed: UserCache = JSON.parse(cached);

      const { data: permData, error } = await supabase
        .from("user_permissions")
        .select("permitted_pages, permitted_sections, permitted_subsections, permitted_actions")
        .eq("user_id", parsed.profile.user_id)
        .single();

      if (error && error.code !== "PGRST116") {
        console.warn("Error fetching permissions:", error.message);
      }

      const latestPermissions: UserPermissions = {
        permitted_pages: permData?.permitted_pages || [],
        permitted_sections: permData?.permitted_sections || [],
        permitted_subsections: permData?.permitted_subsections || [],
        permitted_actions: permData?.permitted_actions || [],
      };

      setPermissions(latestPermissions);

      const updatedCache: UserCache = {
        ...parsed,
        permissions: latestPermissions,
      };

      if (localStorage.getItem("userCache")) {
        localStorage.setItem("userCache", JSON.stringify(updatedCache));
      } else {
        sessionStorage.setItem("userCache", JSON.stringify(updatedCache));
      }
    } catch (err) {
      console.error("Error refreshing permissions:", err);
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  const clearPermissions = useCallback(() => setPermissions(null), []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "userCache") refreshPermissions();
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [refreshPermissions]);

  return {
    permissions,
    isLoading,
    hasPageAccess,
    hasSectionAccess,
    hasSubsectionAccess,
    hasAction,
    refreshPermissions,
    clearPermissions,
  };
}

// ---------------------
// Profile Hook
export function useUserProfile(): UserProfile | null {
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const cached = localStorage.getItem("userCache") || sessionStorage.getItem("userCache");
      if (cached) {
        const parsed: UserCache = JSON.parse(cached);
        return parsed.profile;
      }
    } catch (err) {
      console.error("Error parsing profile cache:", err);
    }
    return null;
  });
  return profile;
}

// ---------------------
// Combined Hook
export function useUserCache() {
  const permissionsData = usePermissions();
  const profile = useUserProfile();

  const refresh = useCallback(async () => {
    await permissionsData.refreshPermissions();
    // If you need to fetch profile from server, do it here
  }, [permissionsData]);

  const clear = useCallback(() => {
    permissionsData.clearPermissions();
    if (typeof window !== "undefined") {
      localStorage.removeItem("userCache");
      sessionStorage.removeItem("userCache");
    }
  }, [permissionsData]);

  return {
    profile,
    permissions: permissionsData.permissions,
    isLoading: permissionsData.isLoading,
    refresh,
    clear,
  };
}