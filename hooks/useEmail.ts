"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export function useEmail() {
  const [email, setEmail] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setEmail(user?.email ?? null);
    };
    
    getUser();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setEmail(session?.user?.email ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase]);

  return { email };
}