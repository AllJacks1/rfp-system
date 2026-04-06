"use client";

import { useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useUserCache } from "./usePermissions";

export function useLogout() {
    const supabase = createClient();
    const { clear } = useUserCache(); // clears React state
    const router = useRouter();

    const logout = useCallback(async () => {
        try {
            // 1️⃣ Sign out from Supabase
            const { error } = await supabase.auth.signOut();
            if (error) console.error("Supabase logout error:", error.message);

            // 2️⃣ Clear local/session cache & React state
            clear();
            localStorage.removeItem("userCache");
            sessionStorage.removeItem("userCache");

            // 3️⃣ Redirect to login
            router.push("/");
        } catch (err: any) {
            console.error("Logout failed:", err.message);
        }
    }, [supabase, clear, router]);

    return { logout };
}