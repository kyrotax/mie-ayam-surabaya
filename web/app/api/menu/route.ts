import { NextResponse } from "next/server";
import { supabase } from "@/src/supabaseClient";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) throw error;

    // Group by category to match the expected shape
    const categoryMap: Record<string, { name: string; order: number; items: typeof data }> = {};
    for (const item of data ?? []) {
      const cat = item.category ?? "Lainnya";
      if (!categoryMap[cat]) categoryMap[cat] = { name: cat, order: item.order_index ?? 99, items: [] };
      categoryMap[cat].items.push(item);
    }

    const categories = Object.values(categoryMap).sort((a, b) => a.order - b.order);

    return NextResponse.json({
      categories,
      totalCategories: categories.length,
      totalItems: (data ?? []).length,
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
