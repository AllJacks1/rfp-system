"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menu,
  Settings,
  LogOut,
  User,
  Home,
  ChevronRight,
  ChevronDown,
  HandCoins,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { NavItem, TopNavigationProps } from "@/lib/interfaces";
import Notifications from "./Notifications";
import { usePermissions } from "@/hooks/usePermissions";

// Full navItems definition (all possible items)
const allNavItems: NavItem[] = [
  { icon: Home, label: "Dashboard", href: "/home" },
  {
    icon: User,
    label: "Employee Portal",
    subsections: [
      {
        label: "Requests",
        subsections: [
          {
            label: "Service Request",
            href: "/home/employee-portal/requests/service-requests",
          },
          {
            label: "Purchase Request",
            href: "/home/employee-portal/requests/purchase-requests",
          },
          {
            label: "Request for Payment",
            href: "/home/employee-portal/requests/request-for-payment",
          },
          {
            label: "Liquidation",
            href: "/home/employee-portal/requests/liquidation",
          },
        ],
      },
    ],
  },
  {
    icon: HandCoins,
    label: "Finance",
    subsections: [
      { label: "Service Requests", href: "/home/finance/service-requests" },
      {
        label: "Purchase Requests",
        href: "/home/finance/purchase-requests",
        badge: "12",
      },
      { label: "Review Requests", href: "/home/finance/review-requests" },
      { label: "Service Order", href: "/home/finance/service-orders" },
      { label: "Purchase Order", href: "/home/finance/purchase-orders" },
      { label: "Review Orders", href: "/home/finance/review-orders" },
      {
        label: "Request for Payment",
        href: "/home/finance/request-for-payment",
      },
      { label: "Liquidation", href: "/home/finance/liquidation" },
      { label: "Settings", href: "/home/finance/settings" },
    ],
  },
  { icon: Settings, label: "Settings", href: "/home/settings" },
];

// Map nav item labels to permission IDs with their types
const labelToPermission: Record<
  string,
  { id: string; type: "page" | "section" | "subsection" }
> = {
  Dashboard: { id: "dashboard", type: "page" },
  "Employee Portal": { id: "employee-portal", type: "page" },
  Requests: { id: "requests", type: "section" },
  "Service Request": { id: "service-request", type: "subsection" },
  "Purchase Request": { id: "purchase-request", type: "subsection" },
  "Request for Payment": { id: "request-for-payment", type: "subsection" },
  Liquidation: { id: "liquidation", type: "subsection" },
  Finance: { id: "finance", type: "page" },
  "Service Requests": { id: "service-requests", type: "section" },
  "Purchase Requests": { id: "purchase-requests", type: "section" },
  "Review Requests": { id: "review-requests", type: "section" },
  "Service Order": { id: "service-order", type: "section" },
  "Purchase Order": { id: "purchase-order", type: "section" },
  "Review Orders": { id: "review-orders", type: "section" },
  "Finance Settings": { id: "finance-settings", type: "section" },
  Settings: { id: "settings", type: "page" },
};

export default function TopNavigation({
  notifications = [],
}: TopNavigationProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  
  const {
    hasPageAccess,
    hasSectionAccess,
    hasSubsectionAccess,
    isLoading,
  } = usePermissions();

  // Check permission based on type
  const checkPermission = useCallback(
    (permission: { id: string; type: "page" | "section" | "subsection" }): boolean => {
      switch (permission.type) {
        case "page":
          return hasPageAccess(permission.id);
        case "section":
          return hasSectionAccess(permission.id);
        case "subsection":
          return hasSubsectionAccess(permission.id);
        default:
          return false;
      }
    },
    [hasPageAccess, hasSectionAccess, hasSubsectionAccess]
  );

  const isActive = useCallback(
    (item: NavItem): boolean => {
      if (item.href) {
        if (pathname === item.href) return true;
        if (item.href !== "/home" && pathname.startsWith(`${item.href}/`)) {
          return true;
        }
      }
      if (item.subsections?.some((sub) => isActive(sub))) return true;
      return false;
    },
    [pathname]
  );

  const toggleExpand = useCallback((label: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  }, []);

  const renderNavItem = useCallback(
    (item: NavItem, depth: number = 0): React.ReactNode => {
      const hasSubs = item.subsections && item.subsections.length > 0;
      const active = isActive(item);
      const expanded = expandedItems.has(item.label);
      const paddingLeft = depth * 16 + 12;

      const renderItem = (navItem: NavItem, navDepth: number): React.ReactNode => {
        const navHasSubs = navItem.subsections && navItem.subsections.length > 0;
        const navActive = isActive(navItem);
        const navExpanded = expandedItems.has(navItem.label);
        const navPaddingLeft = navDepth * 16 + 12;

        return (
          <div key={`${navDepth}-${navItem.label}`} className="flex flex-col">
            {navHasSubs ? (
              <button
                onClick={() => toggleExpand(navItem.label)}
                className={`group flex items-center gap-3 rounded-lg px-3 py-3 transition-all text-left w-full ${
                  navActive
                    ? "bg-[#2B3A9F]/10 text-[#2B3A9F]"
                    : "text-slate-600 hover:bg-white hover:text-[#2B3A9F]"
                }`}
                style={{ paddingLeft: navPaddingLeft }}
              >
                {navDepth === 0 && navItem.icon && (
                  <navItem.icon
                    className={`h-5 w-5 ${navActive ? "text-[#2B3A9F]" : ""}`}
                  />
                )}
                {navDepth > 0 && (
                  <div
                    className={`h-2 w-2 rounded-full ${navActive ? "bg-[#2B3A9F]" : "bg-slate-400"}`}
                  />
                )}
                <span className="font-medium flex-1">{navItem.label}</span>
                {navItem.badge && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-600">
                    {navItem.badge}
                  </span>
                )}
                {navExpanded ? (
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                )}
              </button>
            ) : (
              <Link
                href={navItem.href!}
                onClick={() => setIsOpen(false)}
                className={`group flex items-center gap-3 rounded-lg px-3 py-3 transition-all ${
                  pathname === navItem.href
                    ? "bg-[#2B3A9F] text-white"
                    : "text-slate-600 hover:bg-white hover:text-[#2B3A9F]"
                }`}
                style={{ paddingLeft: navPaddingLeft }}
              >
                {navDepth === 0 && navItem.icon && (
                  <navItem.icon
                    className={`h-5 w-5 ${pathname === navItem.href ? "text-white" : ""}`}
                  />
                )}
                {navDepth > 0 && (
                  <div
                    className={`h-1.5 w-1.5 rounded-full ${pathname === navItem.href ? "bg-white" : "bg-slate-400"}`}
                  />
                )}
                <span className="font-medium">{navItem.label}</span>
                <ChevronRight
                  className={`ml-auto h-4 w-4 transition-all ${
                    pathname === navItem.href
                      ? "opacity-100 text-white"
                      : "opacity-0 group-hover:opacity-100"
                  }`}
                />
              </Link>
            )}

            {navHasSubs && navExpanded && (
              <div
                className={`mt-1 flex flex-col gap-1 ${
                  navDepth === 0 ? "ml-4 border-l-2 border-slate-200 pl-4" : "ml-2 pl-2"
                }`}
              >
                {navItem.subsections!.map((sub) => renderItem(sub, navDepth + 1))}
              </div>
            )}
          </div>
        );
      };

      return renderItem(item, depth);
    },
    [expandedItems, isActive, pathname, toggleExpand]
  );

  // Filter nav items based on permissions
  const navItems = useMemo(() => {
    if (isLoading) return [];

    const filterItem = (item: NavItem, depth: number = 0): NavItem | null => {
      // Dashboard always shown (checked in main page)
      if (item.label === "Dashboard") {
        return item;
      }

      const permission = labelToPermission[item.label];

      // If no permission defined, show item (backward compatibility)
      if (!permission) {
        // Still filter children if they exist
        if (item.subsections) {
          const filteredSubs = item.subsections
            .map((sub) => filterItem(sub, depth + 1))
            .filter((sub): sub is NavItem => sub !== null);

          return filteredSubs.length > 0
            ? { ...item, subsections: filteredSubs }
            : null;
        }
        return item;
      }

      // Check permission for this item
      if (!checkPermission(permission)) {
        return null;
      }

      // Filter subsections recursively
      if (item.subsections) {
        const filteredSubs = item.subsections
          .map((sub) => filterItem(sub, depth + 1))
          .filter((sub): sub is NavItem => sub !== null);

        // Show item if it has permitted subsections or has its own href
        if (filteredSubs.length > 0 || item.href) {
          return {
            ...item,
            subsections: filteredSubs,
          };
        }

        // No subsections and no href - still show if permitted (container)
        return {
          ...item,
          subsections: [],
        };
      }

      return item;
    };

    return allNavItems
      .map((item) => filterItem(item, 0))
      .filter((item): item is NavItem => item !== null);
  }, [checkPermission, isLoading]);

  // Auto-expand active routes
  useEffect(() => {
    const findParents = (items: NavItem[], path: string, parents: string[] = []): string[] => {
      for (const item of items) {
        if (item.href && (path === item.href || path.startsWith(`${item.href}/`))) {
          return parents;
        }
        if (item.subsections) {
          const found = findParents(item.subsections, path, [...parents, item.label]);
          if (found.length > 0) return found;
        }
      }
      return [];
    };

    const parents = findParents(navItems, pathname);
    if (parents.length > 0) {
      setExpandedItems((prev) => new Set([...prev, ...parents]));
    }
  }, [pathname, navItems]);

  if (isLoading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="flex h-16 items-center justify-center px-4">
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#2B3A9F]/30 border-t-[#2B3A9F]" />
            <span className="text-slate-500">Loading navigation...</span>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left: Hamburger + Logo */}
        <div className="flex items-center gap-4">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0">
                <Menu className="h-6 w-6 text-slate-700" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0 bg-slate-50">
              <SheetHeader className="border-b border-slate-200 bg-white p-6">
                <SheetTitle className="flex items-center gap-3">
                  <Image
                    src="/astra_logo_small.png"
                    alt="Astra"
                    width={50}
                    height={50}
                    priority
                  />
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-slate-900">
                      Astra Portal
                    </span>
                    <span className="text-xs text-slate-500">
                      Astra Business Solutions
                    </span>
                  </div>
                </SheetTitle>
              </SheetHeader>

              <nav className="flex flex-col gap-1 p-4 pb-24">
                {navItems.map((item) => renderNavItem(item, 0))}
              </nav>

              <div className="absolute bottom-0 left-0 right-0 border-t border-slate-200 bg-white p-4">
                <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
                  <Avatar className="h-10 w-10 border-2 border-white">
                    <AvatarImage src="/avatar.png" />
                    <AvatarFallback className="bg-[#2B3A9F]/20 text-indigo-700">
                      JD
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">John Doe</span>
                    <span className="text-xs text-slate-500">john@astra.com</span>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/home" className="flex items-center gap-3">
            <Image
              src="/astra_logo_small.png"
              alt="Astra"
              width={50}
              height={50}
              priority
            />
            <div className="hidden sm:flex flex-col">
              <span className="text-lg font-bold text-slate-900">Astra Portal</span>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                Astra Business Solutions
              </span>
            </div>
          </Link>
        </div>

        {/* Right: Notifications + User */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Notifications initialNotifications={notifications} />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-9 w-9 rounded-full p-0">
                <Avatar className="h-9 w-9 border-2 border-slate-200">
                  <AvatarImage src="/avatar.png" />
                  <AvatarFallback className="bg-gradient-to-br from-[#2B3A9F] to-[#2B3A9F]/60 text-white">
                    JD
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold">John Doe</p>
                  <p className="text-xs text-slate-500">john.doe@astra.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="h-4 w-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <LogOut className="h-4 w-4 mr-2" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}