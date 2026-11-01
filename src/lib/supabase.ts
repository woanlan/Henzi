import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes("your-project") &&
  !supabaseAnonKey.includes("your-anon-key")
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helper to log status once
if (typeof window !== "undefined") {
  if (isSupabaseConfigured) {
    console.info("⚡ Supabase connected successfully.");
  } else {
    console.info("📦 Running in Local Mode with rich offline database.");
  }
}
