import { NextResponse, NextRequest } from 'next/server';
import jwt from 'jwt-decode';
import envVar from '@/env.json';

interface UserType {
  tenant_id: number;
  sub: string;
  token_use: string;
  name: string;
  exp: number;
  iat: number;
  email: string;
}

export async function middleware(req: NextRequest) {
  const dpAccessToken = req.cookies.get('dp_access_token')?.value;
  const dpRefreshToken = req.cookies.get('dp_refresh_token')?.value;
  const iv = new Uint8Array(envVar.AUTH_IV);
  const keyString = envVar.AUTH_SECRET;
  const keyData = Uint8Array.from(atob(keyString), (c) => c.charCodeAt(0));
  const encryptionKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    'AES-GCM',
    true,
    ['encrypt', 'decrypt']
  );
  const meHandler = async () => {
    if (dpAccessToken && req.nextUrl.pathname !== '/tst3') {
      try {
        const encryptedTokenBuffer = Uint8Array.from(atob(dpAccessToken), (c) =>
          c.charCodeAt(0)
        );
        const decryptedTokenBuffer = await crypto.subtle.decrypt(
          {
            name: 'AES-GCM',
            iv,
          },
          encryptionKey,
          encryptedTokenBuffer
        );

        const decryptedToken = new TextDecoder().decode(decryptedTokenBuffer);

        const jwtDecoded: any = jwt(decryptedToken as unknown as string);
        const userObj: UserType = {
          tenant_id: jwtDecoded.tenant_id,
          sub: jwtDecoded.sub,
          token_use: jwtDecoded.token_use,
          name: jwtDecoded.name,
          exp: jwtDecoded.exp,
          iat: jwtDecoded.iat,
          email: jwtDecoded.email,
        };
        return userObj;
      } catch (error) {
        const res = NextResponse.next();
        res.cookies.delete('dp_access_token');
        res.cookies.delete('dp_refresh_token');
        return res;
      }
    }
  };
  const user = await meHandler();
  if (req.nextUrl.pathname !== '/tst3' && user && 'exp' in user) {
    if (user?.exp < Date.now() / 1000 && dpRefreshToken) {
      const encryptedOldTokenBuffer = Uint8Array.from(
        atob(dpRefreshToken),
        (c) => c.charCodeAt(0)
      );
      const decryptedOldTokenBuffer = await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv,
        },
        encryptionKey,
        encryptedOldTokenBuffer
      );

      const decryptedToken = new TextDecoder().decode(decryptedOldTokenBuffer);
      req.cookies.set({
        name: 'dp_refresh_token',
        value: decryptedToken,
      });
      const response = await fetch(
        `https://aws-auth-rs-production.up.railway.app/refresh?dp_refresh_token=${decryptedToken}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Cookie: `dp_refresh_token=${decryptedToken}}`,
          },
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
        if (
          accessToken === undefined ||
          refreshToken === undefined ||
          accessToken === null ||
          refreshToken === null
        ) {
          return NextResponse.redirect(
            'https://main.d22u058tq4zno8.amplifyapp.com/tst3'
          );
        }
        const encryptedTokenBuffer = await crypto.subtle.encrypt(
          {
            name: 'AES-GCM',
            iv,
          },
          encryptionKey,
          new TextEncoder().encode(accessToken)
        );
        const encryptedRefreshTokenBuffer = await crypto.subtle.encrypt(
          {
            name: 'AES-GCM',
            iv,
          },
          encryptionKey,
          new TextEncoder().encode(refreshToken)
        );
        const encryptedTokenString = btoa(
          String.fromCharCode(...new Uint8Array(encryptedTokenBuffer))
        );
        const encryptedRefreshTokenString = btoa(
          String.fromCharCode(...new Uint8Array(encryptedRefreshTokenBuffer))
        );

        if (accessToken !== null && refreshToken !== null) {
          const res = NextResponse.next();
          res.cookies.set('dp_access_token', encryptedTokenString, {
            httpOnly: true,
          });
          res.cookies.set('dp_refresh_token', encryptedRefreshTokenString, {
            httpOnly: true,
          });
          return res;
        }
      } else {
        const res = NextResponse.next();
        res.cookies.delete('dp_access_token');
        res.cookies.delete('dp_refresh_token');
        return res;
      }
    }
  }
  if (req.nextUrl.pathname === '/tst1') {
    if (!dpAccessToken) {
      return NextResponse.redirect(
        'https://main.d22u058tq4zno8.amplifyapp.com/tst3'
      );
    }
  }

  return NextResponse.next();
}
