"use client";

import { useCallback, useEffect, useState } from "react";

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
  refreshPermissions: () => void;
  clearPermissions: () => void;
}

export function usePermissions(): UsePermissionsReturn {
  // Initialize from cache immediately
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

  // Check if running on client
  const isClient = typeof window !== "undefined";

  // Permission check functions - memoized with useCallback
  const hasPageAccess = useCallback((pageId: string): boolean => {
    if (!permissions) return false;
    return permissions.permitted_pages.includes(pageId);
  }, [permissions]);

  const hasSectionAccess = useCallback((sectionId: string): boolean => {
    if (!permissions) return false;
    return permissions.permitted_sections.includes(sectionId);
  }, [permissions]);

  const hasSubsectionAccess = useCallback((subsectionId: string): boolean => {
    if (!permissions) return false;
    return permissions.permitted_subsections.includes(subsectionId);
  }, [permissions]);

  const hasAction = useCallback((actionId: string): boolean => {
    if (!permissions) return false;
    return permissions.permitted_actions.includes(actionId);
  }, [permissions]);

  // Refresh permissions from storage
  const refreshPermissions = useCallback(() => {
    if (!isClient) return;

    setIsLoading(true);
    try {
      const cached = localStorage.getItem("userCache") || sessionStorage.getItem("userCache");
      if (cached) {
        const parsed: UserCache = JSON.parse(cached);
        setPermissions(parsed.permissions);
      }
    } catch (error) {
      console.error("Error refreshing permissions:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isClient]);

  // Clear permissions (e.g., on logout)
  const clearPermissions = useCallback(() => {
    setPermissions(null);
  }, []);

  // Listen for storage changes (multi-tab support)
  useEffect(() => {
    if (!isClient) return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "userCache" || e.key === "userCache") {
        refreshPermissions();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [isClient, refreshPermissions]);

  // Single return statement with all functions
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

// Helper hook to get user profile
export function useUserProfile(): UserProfile | null {
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    if (typeof window === "undefined") return null;
    
    try {
      const cached = localStorage.getItem("userCache") || sessionStorage.getItem("userCache");
      if (cached) {
        const parsed: UserCache = JSON.parse(cached);
        return parsed.profile;
      }
    } catch (error) {
      console.error("Error parsing profile cache:", error);
    }
    return null;
  });

  return profile;
}

// Combined hook for both profile and permissions
export function useUserCache(): {
  profile: UserProfile | null;
  permissions: UserPermissions | null;
  isLoading: boolean;
  refresh: () => void;
  clear: () => void;
} {
  const permissionsData = usePermissions();
  const profile = useUserProfile();

  const refresh = useCallback(() => {
    permissionsData.refreshPermissions();
    // Profile would refresh here too if needed
    window.location.reload(); // Simple refresh approach
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