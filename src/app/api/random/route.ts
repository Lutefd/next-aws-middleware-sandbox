import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, res: NextResponse) {
  const random = Math.floor(Math.random() * 437923);
  return NextResponse.json({ random });
}
export const revalidate = 0;
