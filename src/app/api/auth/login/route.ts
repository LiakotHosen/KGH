import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const inputEmail = (email || "").trim().toLowerCase();
    const inputPassword = (password || "").trim();

    if (!inputEmail || !inputPassword) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    let isAuthenticated = false;
    let authenticatedEmail = inputEmail;

    // 1. Primary: Verify directly against the Supabase database `admin_users` table
    if (isSupabaseConfigured) {
      try {
        const { data: adminUser, error: dbError } = await supabase
          .from("admin_users")
          .select("id, email, password, is_active, role")
          .ilike("email", inputEmail)
          .eq("is_active", true)
          .maybeSingle();

        if (!dbError && adminUser && adminUser.password === inputPassword) {
          isAuthenticated = true;
          authenticatedEmail = adminUser.email;
        }
      } catch (err) {
        console.error("Supabase admin verification error:", err);
      }
    }

    // 2. Secondary fallback: Check environment variables (.env.local)
    if (!isAuthenticated) {
      const envEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
      const envPassword = (process.env.ADMIN_PASSWORD || "").trim();

      if (envEmail && envPassword && inputEmail === envEmail && inputPassword === envPassword) {
        isAuthenticated = true;
        authenticatedEmail = envEmail;
      }
    }

    if (isAuthenticated) {
      // Create session token signed with SECRET_KEY
      const secretKey = process.env.ADMIN_SECRET_KEY || "kgh_dental_secret_2026";
      const sessionToken = Buffer.from(
        `${authenticatedEmail}:${Date.now()}:${secretKey}`
      ).toString("base64");

      const cookieStore = await cookies();
      cookieStore.set("kgh_admin_session", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return NextResponse.json({
        success: true,
        message: "Authentication successful",
        adminEmail: authenticatedEmail,
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid admin email or password" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Auth login error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
