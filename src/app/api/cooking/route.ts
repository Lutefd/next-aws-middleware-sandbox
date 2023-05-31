import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, res: NextResponse) {
  const random = Math.floor(Math.random() * 437923);
  NextResponse.redirect('http://localhost:3000/tst1');
  return new Response(random.toString(), {
    status: 200,
    headers: {
      'Set-Cookie': `access=${random.toString()}; path=/; HttpOnly;`,
    },
  });
}
