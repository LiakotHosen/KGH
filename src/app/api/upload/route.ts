import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename and create unique timestamped name
    const timestamp = Date.now();
    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${timestamp}_${cleanName}`;

    // If Supabase is configured, upload to Supabase Storage
    if (isSupabaseConfigured) {
      try {
        const supabase = await createServerSupabaseClient();
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("kgh-media")
          .upload(filename, buffer, {
            contentType: file.type,
            upsert: true,
          });

        if (!uploadError && uploadData) {
          const { data: publicUrlData } = supabase.storage
            .from("kgh-media")
            .getPublicUrl(filename);

          const publicUrl = publicUrlData.publicUrl;

          // Record in media_files table
          await supabase.from("media_files").insert({
            name: file.name,
            url: publicUrl,
            size_bytes: file.size,
            mime_type: file.type,
          });

          return NextResponse.json({
            success: true,
            url: publicUrl,
            name: file.name,
          });
        }
      } catch (err) {
        console.warn("Supabase storage upload failed, falling back to local:", err);
      }
    }

    // Local Disk Fallback: Write directly to public/images/uploads/
    const uploadDir = path.join(process.cwd(), "public", "images", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    const localUrl = `/images/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      url: localUrl,
      name: file.name,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
