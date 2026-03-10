"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";
import { NotificationsProps } from "@/lib/interfaces";

export default function Notifications({ initialNotifications }: NotificationsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-slate-100"
        >
          <Bell className="h-5 w-5 text-slate-600" />
          {initialNotifications.some((n) => n.unread) && (
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white animate-pulse" />
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          <Badge variant="secondary" className="text-xs">
            {initialNotifications.filter((n) => n.unread).length} new
          </Badge>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-80 overflow-y-auto">
          {initialNotifications.map((notification) => (
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
  );
}
