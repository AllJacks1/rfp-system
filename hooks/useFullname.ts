"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function useFullName() {
  const [fullName, setFullName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function fetchUser() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (!error && user) {
        setFullName(user.user_metadata?.full_name ?? null);
      }

      setLoading(false);
    }

    fetchUser();
  }, []);

  return { fullName, loading };
}