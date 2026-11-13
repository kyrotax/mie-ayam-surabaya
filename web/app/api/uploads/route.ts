// Signed URL ke storage
import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ uploadUrl: '' });
}
