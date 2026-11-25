import { NextResponse } from "next/server";
import { supabase } from "@/src/supabaseClient";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { data: status, error } = await supabase
      .from("store_status")
      .select("*")
      .order("id", { ascending: false })
      .limit(1)
      .single();

    if (error || !status) {
      return NextResponse.json({
        isOpen: true,
        statusNote: "Buka",
        nextOpenText: null,
      });
    }

    // Determine current status based on manual override or schedule
    let isOpen = Boolean(status.is_open);

    // If no manual override, check current WIB time against default schedule
    if (!status.manual_override || status.manual_override === "none") {
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const wibDate = new Date(utc + 3600000 * 7);
      const currentDay = wibDate.getDay(); // 0=Sun, 1=Mon...
      const currentTimeNum = wibDate.getHours() * 60 + wibDate.getMinutes();

      // Default schedule: open Tue-Sun (days 0,2-6), 13:00-21:00; closed Mon (day 1)
      const isClosedDay = currentDay === 1;
      if (!isClosedDay) {
        isOpen = currentTimeNum >= 780 && currentTimeNum < 1260; // 13:00-21:00
      } else {
        isOpen = false;
      }
    }

    return NextResponse.json({
      isOpen,
      manualOverride: status.manual_override,
      statusNote: status.status_note || (isOpen ? "Warung sedang Buka" : "Warung sedang Tutup"),
      nextOpenText: status.next_open_text,
      updatedAt: status.updated_at,
    });
  } catch (error) {
    console.error("Error in GET /api/status:", error);
    return NextResponse.json(
      {
        isOpen: true,
        statusNote: "Buka (fallback)",
        nextOpenText: null,
      },
      { status: 200 }
    );
  }
}
