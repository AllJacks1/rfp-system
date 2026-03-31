"use client";

import { useEffect, useState } from "react";

interface UserPermissions {
  permitted_pages: string[];
  permitted_sections: string[];
  permitted_subsections: string[];
  permitted_actions: string[];
}

interface UserCache {
  profile: {
    user_id: string;
    first_name: string;
    middle_name: string;
    last_name: string;
  };
  permissions: UserPermissions;
}

export function usePermissions() {
  const [permissions, setPermissions] = useState<UserPermissions | null>(() => {
    const cached =
      localStorage.getItem("userCache") || sessionStorage.getItem("userCache");
    if (cached) {
      const parsed: UserCache = JSON.parse(cached);
      return parsed.permissions;
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Effect can be removed or used for other side effects
  }, []);

  const hasPageAccess = (pageId: string): boolean => {
    if (!permissions) return false;
    return permissions.permitted_pages.includes(pageId);
  };

  const hasSectionAccess = (sectionId: string): boolean => {
    if (!permissions) return false;
    return permissions.permitted_sections.includes(sectionId);
  };

  const hasSubsectionAccess = (subsectionId: string): boolean => {
    if (!permissions) return false;
    return permissions.permitted_subsections.includes(subsectionId);
  };

  const hasAction = (actionId: string): boolean => {
    if (!permissions) return false;
    return permissions.permitted_actions.includes(actionId);
  };

  return {
    permissions,
    isLoading,
    hasPageAccess,
    hasSectionAccess,
    hasSubsectionAccess,
    hasAction,
  };
}
