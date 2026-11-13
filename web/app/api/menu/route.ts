import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const categories = await prisma.menuCategory.findMany({
      orderBy: { order: "asc" },
      include: {
        items: {
          orderBy: { order: "asc" },
        },
      },
    });

    return NextResponse.json({
      categories,
      totalCategories: categories.length,
      totalItems: categories.reduce((acc, cat) => acc + cat.items.length, 0),
    });
  } catch (error) {
    console.error("Error in GET /api/menu:", error);
    return NextResponse.json(
      {
        categories: [],
        error: "Gagal memuat data menu",
      },
      { status: 500 }
    );
  }
}
