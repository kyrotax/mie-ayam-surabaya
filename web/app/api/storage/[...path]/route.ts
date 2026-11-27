import { NextResponse, type NextRequest } from "next/server";
import { supabase } from "@/src/supabaseClient";

const BUCKET_CANDIDATES = [
  "mie-ayam-surabaya",
  "MIE-AYAN-SURABAYA",
  "MIE-AYAM-SURABAYA",
  "mie-ayan-surabaya",
];

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await context.params;
    const filePath = Array.isArray(path) ? path.join("/") : "";

    if (!filePath) {
      return new NextResponse("File path missing", { status: 400 });
    }

    // 1. Try to get a signed URL across all known bucket variants
    for (const bucket of BUCKET_CANDIDATES) {
      try {
        const { data, error } = await supabase.storage
          .from(bucket)
          .createSignedUrl(filePath, 60 * 60 * 24);

        if (!error && data?.signedUrl) {
          return NextResponse.redirect(data.signedUrl, {
            status: 307,
            headers: {
              "Cache-Control": "public, max-age=86400, s-maxage=86400",
            },
          });
        }
      } catch {
        // Continue to next bucket candidate
      }
    }

    // 2. Direct download fallback (streams the binary directly to client)
    for (const bucket of BUCKET_CANDIDATES) {
      try {
        const { data: blob, error: dlError } = await supabase.storage
          .from(bucket)
          .download(filePath);

        if (!dlError && blob) {
          const contentType =
            blob.type ||
            (filePath.endsWith(".png")
              ? "image/png"
              : filePath.endsWith(".webp")
              ? "image/webp"
              : "image/jpeg");

          return new NextResponse(blob, {
            status: 200,
            headers: {
              "Content-Type": contentType,
              "Cache-Control": "public, max-age=86400, s-maxage=86400",
            },
          });
        }
      } catch {
        // Continue
      }
    }

    return new NextResponse("File not found in storage", { status: 404 });
  } catch (err: any) {
    return new NextResponse(err.message || "Internal Server Error", { status: 500 });
  }
}
