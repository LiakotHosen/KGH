import { NextResponse } from "next/server";
import { readdir, stat } from "fs/promises";
import path from "path";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export async function GET() {
  const allMedia: Array<{ id: string; name: string; url: string; source: "supabase" | "local" }> = [];

  // 1. Fetch from Supabase if configured
  if (isSupabaseConfigured) {
    try {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase
        .from("media_files")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        data.forEach((item) => {
          allMedia.push({
            id: item.id,
            name: item.name,
            url: item.url,
            source: "supabase",
          });
        });
      }
    } catch (e) {
      console.warn("Error fetching Supabase media_files:", e);
    }
  }

  // 2. Fetch local uploads and department assets from public/images/
  try {
    const foldersToScan = [
      { dir: path.join(process.cwd(), "public", "images", "uploads"), prefix: "/images/uploads" },
      { dir: path.join(process.cwd(), "public", "images", "departments"), prefix: "/images/departments" },
      { dir: path.join(process.cwd(), "public", "images", "doctors"), prefix: "/images/doctors" },
      { dir: path.join(process.cwd(), "public", "images", "logos"), prefix: "/images/logos" },
    ];

    for (const folder of foldersToScan) {
      try {
        const files = await readdir(/*turbopackIgnore: true*/ folder.dir);
        for (const file of files) {
          if (file.match(/\.(png|jpe?g|webp|gif|svg)$/i)) {
            const fullUrl = `${folder.prefix}/${file}`;
            // Avoid duplicate URLs if already in list
            if (!allMedia.some((m) => m.url === fullUrl)) {
              allMedia.push({
                id: `local-${folder.prefix}-${file}`,
                name: file,
                url: fullUrl,
                source: "local",
              });
            }
          }
        }
      } catch {
        // Directory may not exist yet, ignore
      }
    }
  } catch (err) {
    console.error("Local media read error:", err);
  }

  return NextResponse.json({ media: allMedia });
}
