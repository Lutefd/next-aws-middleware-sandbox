import { cookies } from 'next/headers';
import envVar from '@/env.json';
import jwt from 'jwt-decode';
interface UserType {
  tenant_id: number;
  sub: string;
  token_use: string;
  name: string;
  exp: number;
  iat: number;
  email: string;
}

export const meHandler = async () => {
  const cookieStore = cookies();
  const dpAccessToken = cookieStore.get('dp_access_token')?.value;
  const dpRefreshToken = cookieStore.get('dp_refresh_token')?.value;
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
  if (dpAccessToken) {
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
      console.log(error);
    }
  } else {
    return null;
  }
};
