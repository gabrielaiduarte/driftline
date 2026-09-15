import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import "dotenv/config"

const supabaseUrl = process.env.SUPABASE_URL
const supabasePublishableKey = process.env.SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error(
        "Missing SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY in server environment variables"
    )
}

const verifiedSupabaseUrl: string = supabaseUrl
const verifiedSupabasePublishableKey: string = supabasePublishableKey

export function createSupabaseClient ( accessToken? : string) : SupabaseClient {
    return createClient( verifiedSupabaseUrl, verifiedSupabasePublishableKey, {
        global: accessToken
            ? {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        : undefined,
    })
}