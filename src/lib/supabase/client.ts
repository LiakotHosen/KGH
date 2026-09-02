import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  "https://kumltgqxafqjckbdnmnd.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  "sb_publishable_topdg64bkRx3PAE-eM5cjA_NIi5Nhww";

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes("your-project") &&
  !supabaseUrl.includes("placeholder")
);

export function createClient() {
  if (!isSupabaseConfigured) {
    // Return a dummy/safe client or null if not configured
    return createBrowserClient(
      supabaseUrl || "https://placeholder.supabase.co",
      supabaseAnonKey || "placeholder-key"
    );
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = createClient();
