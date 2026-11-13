// Cron job: laporan harian
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ status: 'cron executed' });
}
