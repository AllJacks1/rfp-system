"use client";

import { useState, useEffect } from "react";
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

// Updated navItems with nested subsections
const navItems: NavItem[] = [
  { icon: Home, label: "Dashboard", href: "/home" },
  {
    icon: User,
    label: "Employee Portal",
    subsections: [
      { 
        label: "Requests",
        subsections: [
          { label: "Service Request", href: "/home/employee-portal/requests/service-requests" },
          { label: "Purchase Request", href: "/home/employee-portal/requests/purchase-requests" },
          { label: "Request for Payment", href: "/home/employee-portal/requests/request-for-payment" },
          { label: "Liquidation", href: "/home/employee-portal/requests/liquidation" },
        ]
      },
    ],
  },
  {
    icon: HandCoins,
    label: "Finance",
    subsections: [
      { label: "Service Request", href: "/home/finance/service-requests" },
      {
        label: "Purchase Request",
        href: "/home/finance/purchase-requests",
        badge: "12",
      },
      { label: "Review Requests", href: "/home/finance/review-requests" },
      { label: "Service Order", href: "/home/finance/service-orders" },
      { label: "Purchase Order", href: "/home/finance/purchase-orders" },
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

export default function TopNavigation({
  notifications = [],
}: TopNavigationProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Auto-expand when route matches subsection (at any level)
  useEffect(() => {
    const findAndExpandParents = (items: NavItem[], currentPath: string, parentPath: string[] = []): string[] => {
      for (const item of items) {
        const currentItemPath = [...parentPath, item.label];
        
        // Check if this item's href matches
        if (item.href && (currentPath === item.href || currentPath.startsWith(`${item.href}/`))) {
          return parentPath; // Return all parent labels to expand
        }
        
        // Check subsections recursively
        if (item.subsections) {
          const found = findAndExpandParents(item.subsections, currentPath, currentItemPath);
          if (found.length > 0) {
            return [...parentPath, item.label];
          }
        }
      }
      return [];
    };

    const parentsToExpand = findAndExpandParents(navItems, pathname);
    
    if (parentsToExpand.length > 0) {
      setExpandedItems((prev) => {
        const newExpanded = [...prev];
        parentsToExpand.forEach((parent) => {
          if (!newExpanded.includes(parent)) {
            newExpanded.push(parent);
          }
        });
        return newExpanded;
      });
    }
  }, [pathname]);

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label],
    );
  };

  // Check if this specific item is the exact active page (not just a parent)
  const isExactActive = (href: string): boolean => {
    return pathname === href;
  };

  // Check if this item or any of its children are active
  const isItemActive = (item: NavItem): boolean => {
    // If it has a href, check exact match or if it's a parent of current path
    if (item.href) {
      // Exact match
      if (pathname === item.href) return true;
      // Check if current path starts with this href + "/" (meaning it's a parent)
      // But exclude "/home" from matching "/home/employee-portal" etc
      if (item.href !== "/home" && pathname.startsWith(`${item.href}/`)) return true;
      // Special case: /home should only match exactly, not subpaths
      if (item.href === "/home" && pathname === "/home") return true;
    }
    
    // Check if any subsection is active (recursively)
    if (item.subsections) {
      return item.subsections.some((sub) => isItemActive(sub));
    }
    
    return false;
  };

  const isSubItemActive = (href: string): boolean => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  // Recursive function to render navigation items
  const renderNavItem = (item: NavItem, depth: number = 0) => {
    const hasSubsections = item.subsections && item.subsections.length > 0;
    const isActive = isItemActive(item);
    const isExpanded = expandedItems.includes(item.label);
    const paddingLeft = depth * 4 + 12; // Increasing padding for nested levels

    return (
      <div key={`${depth}-${item.label}`} className="flex flex-col">
        {/* Parent Item */}
        {hasSubsections ? (
          // Expandable item with subsections
          <button
            onClick={() => toggleExpand(item.label)}
            className={`group flex items-center gap-3 rounded-lg px-3 py-3 transition-all text-left ${
              isActive
                ? "bg-[#2B3A9F]/10 text-[#2B3A9F]"
                : "text-slate-600 hover:bg-white hover:text-[#2B3A9F] hover:shadow-sm"
            }`}
            style={{ paddingLeft: `${paddingLeft}px` }}
          >
            {depth === 0 && item.icon && (
              <item.icon
                className={`h-5 w-5 transition-colors ${
                  isActive ? "text-[#2B3A9F]" : "group-hover:text-[#2B3A9F]"
                }`}
              />
            )}
            {depth > 0 && (
              <div className={`h-2 w-2 rounded-full ${isActive ? "bg-[#2B3A9F]" : "bg-slate-400"}`} />
            )}
            <span className="font-medium flex-1">{item.label}</span>
            {item.badge && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  isActive
                    ? "bg-[#2B3A9F] text-white"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {item.badge}
              </span>
            )}
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-slate-400" />
            ) : (
              <ChevronRight className="h-4 w-4 text-slate-400" />
            )}
          </button>
        ) : (
          // Simple link without subsections
          <Link
            href={item.href!}
            onClick={() => setIsOpen(false)}
            className={`group flex items-center gap-3 rounded-lg px-3 py-3 transition-all ${
              isExactActive(item.href!)
                ? "bg-[#2B3A9F] text-white shadow-md"
                : "text-slate-600 hover:bg-white hover:text-[#2B3A9F] hover:shadow-sm"
            }`}
            style={{ paddingLeft: `${paddingLeft}px` }}
          >
            {depth === 0 && item.icon && (
              <item.icon
                className={`h-5 w-5 transition-colors ${
                  isExactActive(item.href!) ? "text-white" : "group-hover:text-[#2B3A9F]"
                }`}
              />
            )}
            {depth > 0 && (
              <div className={`h-1.5 w-1.5 rounded-full ${isExactActive(item.href!) ? "bg-white" : "bg-slate-400"}`} />
            )}
            <span className="font-medium">{item.label}</span>
            <ChevronRight
              className={`ml-auto h-4 w-4 transition-all ${
                isExactActive(item.href!)
                  ? "opacity-100 translate-x-0 text-white"
                  : "opacity-0 group-hover:opacity-100 group-hover:translate-x-1"
              }`}
            />
          </Link>
        )}

        {/* Subsections - Recursive rendering */}
        {hasSubsections && isExpanded && (
          <div className={`mt-1 flex flex-col gap-1 ${depth === 0 ? "ml-4 border-l-2 border-slate-200 pl-4" : "ml-2 pl-2"}`}>
            {item.subsections!.map((sub) => renderNavItem(sub, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left Section: Hamburger + Logo */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Sheet */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 hover:bg-slate-100"
              >
                <Menu className="h-6 w-6 text-slate-700" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0 bg-slate-50 overflow-y-auto">
              <SheetHeader className="border-b border-slate-200 bg-white p-6">
                <SheetTitle className="flex items-center gap-3">
                  <Image
                    src="/astra_logo_small.png"
                    alt="Astra Business Solutions Logo"
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
                  <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                    <AvatarImage src="/avatar.png" />
                    <AvatarFallback className="bg-[#2B3A9F]/20 text-indigo-700 font-semibold">
                      JD
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-900">
                      John Doe
                    </span>
                    <span className="text-xs text-slate-500">
                      john@astra.com
                    </span>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/home" className="flex items-center gap-3 group">
            <Image
              src="/astra_logo_small.png"
              alt="Astra Business Solutions Logo"
              width={50}
              height={50}
              priority
            />
            <div className="hidden sm:flex flex-col">
              <span className="text-lg font-bold text-slate-900 leading-tight">
                Astra Portal
              </span>
              <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                Astra Business Solutions
              </span>
            </div>
          </Link>
        </div>

        {/* Right Section: Notifications + Avatar */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Notifications Dropdown */}
          <Notifications initialNotifications={notifications} />

          {/* User Avatar Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-9 w-9 rounded-full p-0 hover:bg-slate-100"
              >
                <Avatar className="h-9 w-9 border-2 border-slate-200 hover:border-indigo-300 transition-colors">
                  <AvatarImage src="/avatar.png" alt="User" />
                  <AvatarFallback className="bg-linear-to-br from-[#2B3A9F] to-[#2B3A9F]/60 text-white font-semibold text-sm">
                    JD
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold text-slate-900">
                    John Doe
                  </p>
                  <p className="text-xs text-slate-500">john.doe@astra.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 cursor-pointer">
                <User className="h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 cursor-pointer">
                <Settings className="h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 text-red-600 focus:text-red-600 cursor-pointer">
                <LogOut className="h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}