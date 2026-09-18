import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("kgh_admin_session");
  cookieStore.set("kgh_admin_session", "", {
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
  return NextResponse.json({ success: true, message: "Logged out successfully" });
}

export async function GET() {
  const cookieStore = await cookies();
  cookieStore.delete("kgh_admin_session");
  cookieStore.set("kgh_admin_session", "", {
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
  return NextResponse.json({ success: true, message: "Logged out successfully" });
}
