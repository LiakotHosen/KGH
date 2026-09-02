import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("kgh_admin_session")?.value;

  if (sessionToken) {
    try {
      const decoded = Buffer.from(sessionToken, "base64").toString("utf-8");
      const [email] = decoded.split(":");
      const expectedEmail = process.env.ADMIN_EMAIL || "admin@kghdental.com";

      if (email === expectedEmail) {
        return NextResponse.json({ authenticated: true, email });
      }
    } catch {
      // Invalid token
    }
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}
