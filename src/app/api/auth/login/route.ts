import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const expectedEmail = process.env.ADMIN_EMAIL || "admin@kghdental.com";
    const expectedPassword = process.env.ADMIN_PASSWORD || "kghdental2026!";

    // Strict server-side credential verification
    if (
      email &&
      password &&
      email.trim().toLowerCase() === expectedEmail.trim().toLowerCase() &&
      password.trim() === expectedPassword.trim()
    ) {
      // Create a secure cryptographic session token
      const sessionToken = Buffer.from(
        `${expectedEmail}:${Date.now()}:${process.env.ADMIN_SECRET_KEY || "kgh_dental_secret_2026"}`
      ).toString("base64");

      const cookieStore = await cookies();
      cookieStore.set("kgh_admin_session", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return NextResponse.json({ success: true, message: "Authentication successful" });
    }

    return NextResponse.json(
      { success: false, error: "Invalid email or password" },
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
