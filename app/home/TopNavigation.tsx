"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
  Bell,
  Settings,
  LogOut,
  User,
  Home,
  BarChart3,
  FileText,
  Users,
  HelpCircle,
  X,
  ChevronRight,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const navItems = [
  { icon: Home, label: "Dashboard", href: "/home" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: FileText, label: "Reports", href: "/reports" },
  { icon: Users, label: "Team", href: "/team" },
  { icon: Settings, label: "Settings", href: "/settings" },
  { icon: HelpCircle, label: "Help & Support", href: "/help" },
];

export default function TopNavigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications] = useState([
    { id: 1, title: "New report available", time: "2 min ago", unread: true },
    {
      id: 2,
      title: "Team meeting in 30 mins",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      title: "System update completed",
      time: "3 hours ago",
      unread: false,
    },
  ]);

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
            <SheetContent side="left" className="w-[300px] p-0 bg-slate-50">
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

              <nav className="flex flex-col gap-1 p-4">
                {navItems.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`group flex items-center gap-3 rounded-lg px-3 py-3 transition-all ${
                        isActive
                          ? "bg-[#2B3A9F] text-white shadow-md"
                          : "text-slate-600 hover:bg-white hover:text-[#2B3A9F] hover:shadow-sm"
                      }`}
                    >
                      <item.icon
                        className={`h-5 w-5 transition-colors ${
                          isActive ? "text-white" : "group-hover:text-[#2B3A9F]"
                        }`}
                      />
                      <span className="font-medium">{item.label}</span>
                      <ChevronRight
                        className={`ml-auto h-4 w-4 transition-all ${
                          isActive
                            ? "opacity-100 translate-x-0 text-white"
                            : "opacity-0 group-hover:opacity-100 group-hover:translate-x-1"
                        }`}
                      />
                    </Link>
                  );
                })}
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-slate-100"
              >
                <Bell className="h-5 w-5 text-slate-600" />
                {notifications.some((n) => n.unread) && (
                  <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white animate-pulse" />
                )}
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notifications</span>
                <Badge variant="secondary" className="text-xs">
                  {notifications.filter((n) => n.unread).length} new
                </Badge>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className="flex flex-col items-start gap-1 p-3 cursor-pointer focus:bg-slate-50"
                  >
                    <div className="flex w-full items-center justify-between">
                      <span
                        className={`text-sm ${notification.unread ? "font-semibold text-slate-900" : "text-slate-600"}`}
                      >
                        {notification.title}
                      </span>
                      {notification.unread && (
                        <span className="h-2 w-2 rounded-full bg-indigo-500" />
                      )}
                    </div>
                    <span className="text-xs text-slate-400">
                      {notification.time}
                    </span>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center text-sm font-medium text-indigo-600 cursor-pointer">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Avatar Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-9 w-9 rounded-full p-0 hover:bg-slate-100"
              >
                <Avatar className="h-9 w-9 border-2 border-slate-200 hover:border-indigo-300 transition-colors">
                  <AvatarImage src="/avatar.png" alt="User" />
                  <AvatarFallback className="bg-gradient-to-br from-[#2B3A9F] to-[#2B3A9F]/60 text-white font-semibold text-sm">
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
