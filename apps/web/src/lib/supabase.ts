import { createClient } from "@supabase/supabase-js";

// Vite exposes frontend environment variables through import.meta.env
// These values identify which Supabase project Driftline should connect to
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

// Fail if req config is missing
if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY")
}

const REMEMBER_ME_KEY = "driftline-remember-me"

/**
 * Supabase persists sessions in localStorage
 * The adapter uses sessionStorage when users chooses not to remain signed in
 */

const authStorage = {
    getItem(key: string): string | null {
        return (
            localStorage.getItem(key) ??
            sessionStorage.getItem(key)
        )
    },

    setItem(key: string, value: string) : void {
        const rememberMe = localStorage.getItem(REMEMBER_ME_KEY) === "true"

        if (rememberMe) {
            localStorage.setItem(key, value)
            sessionStorage.removeItem(key)
            return
        }

        sessionStorage.setItem(key, value)
        localStorage.removeItem(key)
    },

    removeItem(key: string) : void {
        localStorage.removeItem(key)
        sessionStorage.removeItem(key)
    }
}

// Use Supabase publishable key, Supabase Auth will manage user's session and token
export const supabase = createClient(
    supabaseUrl,
    supabasePublishableKey,
    {
        auth: {
            storage: authStorage,
            persistSession: true,
            autoRefreshToken: true,
        },
    }
)

export function setRememberMe(rememberMe: boolean) {
    localStorage.setItem(REMEMBER_ME_KEY, String(rememberMe))
}