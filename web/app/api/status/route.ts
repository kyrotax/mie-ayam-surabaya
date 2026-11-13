import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [status, schedule] = await Promise.all([
      prisma.storeStatus.findFirst(),
      prisma.operatingSchedule.findMany({
        orderBy: { dayOfWeek: "asc" },
      }),
    ]);

    if (!status) {
      return NextResponse.json({
        isOpen: true,
        statusNote: "Buka",
        nextOpenText: null,
      });
    }

    // Determine current status based on manual override or schedule
    let isOpen = status.isOpen;

    // If not manually overridden, check current time
    if (!status.manualOverride) {
      const now = new Date();
      // WIB is UTC+7
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const wibDate = new Date(utc + 3600000 * 7);
      const currentDay = wibDate.getDay();
      const currentHour = wibDate.getHours();
      const currentMinute = wibDate.getMinutes();
      const currentTimeNum = currentHour * 60 + currentMinute;

      const todaySchedule = schedule.find((s) => s.dayOfWeek === currentDay);
      if (todaySchedule && !todaySchedule.isClosed) {
        const [openH, openM] = todaySchedule.openTime.split(":").map(Number);
        const [closeH, closeM] = todaySchedule.closeTime.split(":").map(Number);
        const openNum = openH * 60 + openM;
        const closeNum = closeH * 60 + closeM;
        isOpen = currentTimeNum >= openNum && currentTimeNum < closeNum;
      } else {
        isOpen = false;
      }
    }

    return NextResponse.json({
      isOpen,
      manualOverride: status.manualOverride,
      statusNote: status.statusNote || (isOpen ? "Warung sedang Buka" : "Warung sedang Tutup"),
      nextOpenText: status.nextOpenText,
      updatedAt: status.updatedAt,
      schedule,
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
