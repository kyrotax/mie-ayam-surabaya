import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error("Konfigurasi Supabase belum lengkap. Periksa .env.local.");
}

export const supabase = createBrowserClient(supabaseUrl, supabasePublishableKey);
export default supabase;
