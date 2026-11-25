import { NextResponse } from "next/server";
import { supabase } from "@/src/supabaseClient";

export const dynamic = "force-dynamic";

// Static fallback data for fields not yet in Supabase
const DEFAULT_PROFILE = {
  address: "Jl. Raya Taman Pinang Indah, Jetis, Lemahputro, Kec. Sidoarjo, Kabupaten Sidoarjo, Jawa Timur 61213",
  whatsappNumber: "6282319195854",
  instagramUrl: "https://www.instagram.com/mieayamsurabaya_/",
  mapsUrl: "https://www.google.com/maps/place/MIE+AYAM+SURABAYA,+Jl.+Raya+Taman+Pinang+Indah",
  mapsEmbedUrl:
    "https://maps.google.com/maps?q=MIE%20AYAM%20SURABAYA%20Taman%20Pinang%20Indah%20Sidoarjo&t=&z=15&ie=UTF8&iwloc=&output=embed",
};

export async function GET() {
  try {
    // Load store status from Supabase (gallery and schedule not yet in DB — use defaults)
    const { data: statusRow } = await supabase
      .from("store_status")
      .select("status_note, is_open, next_open_text")
      .order("id", { ascending: false })
      .limit(1)
      .single();

    return NextResponse.json({
      profile: DEFAULT_PROFILE,
      gallery: [],
      schedule: [],
      status: statusRow ?? null,
    });
  } catch (error) {
    console.error("Error in GET /api/content:", error);
    return NextResponse.json(
      {
        profile: DEFAULT_PROFILE,
        gallery: [],
        schedule: [],
        error: "Gagal memuat konten profil",
      },
      { status: 200 }
    );
  }
}
