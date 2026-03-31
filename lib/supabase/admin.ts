import { createClient } from "@supabase/supabase-js";

export function getSupabaseAdmin() {
  if (typeof window !== "undefined") {
    throw new Error("Supabase admin client cannot run in the browser");
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}