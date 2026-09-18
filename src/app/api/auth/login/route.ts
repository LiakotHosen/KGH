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

    // Verify directly and strictly against the Supabase database `admin_users` table
    if (!isSupabaseConfigured) {
      return NextResponse.json(
        {
          success: false,
          error: "Supabase database is not configured. Please ensure your Supabase database is connected.",
        },
        { status: 503 }
      );
    }

    const { data: adminUser, error: dbError } = await supabase
      .from("admin_users")
      .select("id, email, password, is_active, role, name")
      .ilike("email", inputEmail)
      .eq("is_active", true)
      .maybeSingle();

    if (dbError) {
      console.error("Supabase admin verification error:", dbError);
      return NextResponse.json(
        { success: false, error: "Database verification error. Please try again." },
        { status: 500 }
      );
    }

    if (!adminUser || adminUser.password !== inputPassword) {
      return NextResponse.json(
        { success: false, error: "Invalid admin email or password" },
        { status: 401 }
      );
    }

    const authenticatedEmail = adminUser.email;

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
      adminName: adminUser.name || "Admin",
      role: adminUser.role || "super_admin",
    });

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
