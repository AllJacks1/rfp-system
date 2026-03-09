"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export default function Authentication() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  async function handleSubmit() {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
    router.push("/home");
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#1b2365] via-[#3a42a5] to-[#1b2365] px-6">
      {/* Background Glow */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-[420px] w-[420px] rounded-full bg-indigo-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-[420px] w-[420px] rounded-full bg-blue-400/20 blur-3xl" />

      <Card className="w-[380px] border-0 bg-white shadow-2xl backdrop-blur-xl">
        {/* HEADER */}
        <CardHeader className="space-y-6 pb-6">
          <div className="flex justify-center mt-4">
            <Image
              src="/astra_logo.png"
              alt="Astra Business Solutions Logo"
              width={110}
              height={110}
              priority
            />
          </div>

          <div className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold tracking-tight text-[#2B3A9F]">
              Welcome Back
            </CardTitle>
            <p className="text-sm text-slate-500">
              Sign in to access the Astra Portal
            </p>
          </div>
        </CardHeader>

        {/* FORM */}
        <CardContent className="space-y-5">
          {/* EMAIL */}
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <Mail className="h-4 w-4 text-slate-400" />
              Email Address
            </Label>

            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="name@company.com"
              autoComplete="username"
              className="h-11 bg-slate-50/70"
            />
          </div>

          {/* PASSWORD */}
          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <Lock className="h-4 w-4 text-slate-400" />
              Password
            </Label>

            <div className="relative">
              <Input
                id="password"
                name="password"
                required
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="current-password"
                className="h-11 pr-10 bg-slate-50/70"
              />

              <button
                type="button"
                aria-label="Toggle password visibility"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* REMEMBER */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(v) => setRememberMe(!!v)}
              className="data-checked:bg-[#2B3A9F]"
            />

            <Label
              htmlFor="remember"
              className="text-sm font-normal text-slate-600 cursor-pointer"
            >
              Remember me for 30 days
            </Label>
          </div>

          {/* BUTTON */}
          <Button
            type="submit"
            disabled={isLoading}
            className="group h-11 w-full bg-[#2B3A9F] font-semibold text-white shadow-lg transition hover:from-blue-700 hover:to-blue-800"
            onClick={() => {
              handleSubmit();
            }}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Signing in...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                Sign In
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
