"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";

import { createClient } from "@/lib/supabase/client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export default function Authentication() {
  const supabase = createClient();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login error:", error.message);
      alert(error.message);
      setIsLoading(false);
      return;
    }

    const uuid = data.user?.id;

    if (!uuid) {
      alert("User UUID not found");
      setIsLoading(false);
      return;
    }

    // Fetch your internal user record
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("user_id")
      .eq("auth_user_id", uuid)
      .single();

    if (userError) {
      console.error("User fetch error:", userError);
      setIsLoading(false);
      return;
    }

    // Cache it
    localStorage.setItem("userProfile", JSON.stringify(userData));

    router.push("/home");
    router.refresh();
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-[#1b2365] via-[#3a42a5] to-[#1b2365] px-6">
      {/* Background Glow */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-105 w-105 rounded-full bg-indigo-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-105 w-105 rounded-full bg-blue-400/20 blur-3xl" />

      <Card className="w-95 border-0 bg-white shadow-2xl backdrop-blur-xl">
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
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
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
                type="email"
                required
                placeholder="name@company.com"
                autoComplete="username"
                className="h-11 bg-slate-50/70"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                  required
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="h-11 pr-10 bg-slate-50/70"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
