import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const reqBody = await req.json();

  const response = await fetch(
    'https://aws-auth-test-server-production.up.railway.app/login',
    {
      method: 'POST',
      body: JSON.stringify(reqBody),
      headers: { 'Content-Type': 'application/json' },
    }
  );
  const newCookie = response.headers.get('set-cookie');
  if (newCookie !== null) {
    const accessTokenRegex = /dp_access_token=([^;]+)/;
    const refreshTokenRegex = /dp_refresh_token=([^;]+)/;

    const accessTokenMatch = newCookie.match(accessTokenRegex);
    const refreshTokenMatch = newCookie.match(refreshTokenRegex);

    const accessToken = accessTokenMatch && accessTokenMatch[1];
    const refreshToken = refreshTokenMatch && refreshTokenMatch[1];

    return NextResponse.json({ accessToken, refreshToken });
  }
}
export const revalidate = 1;
