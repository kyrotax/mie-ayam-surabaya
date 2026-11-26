import { createClient } from "@supabase/supabase-js";

// ============================================================================
// SUPABASE CONFIGURATION — reads from .env (NEXT_PUBLIC_*) with hardcoded fallback
// ============================================================================
export const SUPABASE_URL =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_SUPABASE_URL) ||
  "https://fidpdnscwysqrcadagmq.supabase.co";

export const SUPABASE_PUBLIC_KEY =
  (typeof process !== "undefined" &&
    (process.env?.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY)) ||
  "sb_publishable_DPohBpc8xplzlccUCxILjQ_UyOI0SKy";

// Initialize and export the Supabase client (both named and default export)
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
export default supabase;
