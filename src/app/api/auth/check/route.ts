import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

export async function GET() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("kgh_admin_session")?.value;

  if (sessionToken) {
    try {
      const decoded = Buffer.from(sessionToken, "base64").toString("utf-8");
      const [email, timestamp, secret] = decoded.split(":");
      const expectedSecret = process.env.ADMIN_SECRET_KEY || "kgh_dental_secret_2026";

      const tokenAge = Date.now() - Number(timestamp);
      const isSecretValid = secret === expectedSecret;
      const isFresh = !isNaN(tokenAge) && tokenAge < 7 * 24 * 60 * 60 * 1000;

      if (email && isSecretValid && isFresh) {
        if (isSupabaseConfigured) {
          const { data: adminUser, error } = await supabase
            .from("admin_users")
            .select("id, email, is_active, role, name")
            .ilike("email", email)
            .eq("is_active", true)
            .maybeSingle();

          if (error || !adminUser) {
            cookieStore.delete("kgh_admin_session");
            return NextResponse.json({ authenticated: false }, { status: 401 });
          }

          return NextResponse.json({
            authenticated: true,
            email: adminUser.email,
            name: adminUser.name,
            role: adminUser.role,
          });
        }

        return NextResponse.json({ authenticated: true, email });
      }
    } catch {
      // Invalid token
    }
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}
