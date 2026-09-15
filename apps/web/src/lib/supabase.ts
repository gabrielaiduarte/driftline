import { createClient } from "@supabase/supabase-js";

// Vite exposes frontend environment variables through import.meta.env
// These values identify which Supabase project Driftline should connect to
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

// Fail if req config is missing
if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY")
}

// Use Supabase publishable key, Supabase Auth will manage user's session and token
export const supabase = createClient(
    supabaseUrl,
    supabasePublishableKey
)