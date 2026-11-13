import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [profile, gallery, schedule] = await Promise.all([
      prisma.storeProfile.findFirst(),
      prisma.galleryImage.findMany({
        orderBy: { order: "asc" },
      }),
      prisma.operatingSchedule.findMany({
        orderBy: { dayOfWeek: "asc" },
      }),
    ]);

    return NextResponse.json({
      profile,
      gallery,
      schedule,
    });
  } catch (error) {
    console.error("Error in GET /api/content:", error);
    return NextResponse.json(
      {
        profile: null,
        gallery: [],
        schedule: [],
        error: "Gagal memuat konten profil",
      },
      { status: 500 }
    );
  }
}
