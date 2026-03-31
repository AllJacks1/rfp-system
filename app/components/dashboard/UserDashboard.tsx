"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Calendar, Building2 } from "lucide-react";

export default function UserDashboard() {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    // Update every second
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Format date and time for Asia/Manila
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-PH", {
      timeZone: "Asia/Manila",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-PH", {
      timeZone: "Asia/Manila",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl border-0 shadow-2xl">
        <CardContent className="p-12 text-center space-y-8">
          {/* Logo/Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-2xl bg-[#2B3A9F]/10 flex items-center justify-center">
              <Building2 className="w-10 h-10 text-[#2B3A9F]" />
            </div>
          </div>

          {/* Welcome Message */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
              Welcome to Astra Portal
            </h1>
            <p className="text-lg text-slate-500">
              Your gateway to streamlined business solutions
            </p>
          </div>

          {/* Divider */}
          <div className="w-24 h-1 bg-[#2B3A9F]/20 rounded-full mx-auto" />

          {/* Real-time Clock */}
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-slate-400">
              <Clock className="w-5 h-5" />
              <span className="text-sm font-medium uppercase tracking-wider">
                Manila Time (PHT)
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-6xl font-bold text-[#2B3A9F] tabular-nums tracking-tight">
                {formatTime(currentTime)}
              </div>
              <div className="flex items-center justify-center gap-2 text-slate-500">
                <Calendar className="w-4 h-4" />
                <span className="text-lg">{formatDate(currentTime)}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 text-sm text-slate-400">
            UTC+8 • Philippine Standard Time
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
