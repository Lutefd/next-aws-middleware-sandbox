'use server';

import { cookies } from 'next/headers';
import envVar from '@/env.json';

import { Amplify } from 'aws-amplify';
import awsExports from '@/aws-exports';

Amplify.configure({ ...awsExports, ssr: true });

export async function HandleSubmit(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const data = JSON.stringify({ email, password });

  const getData = async () => {
    const res = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 1,
      },
      body: data,
    });
    const response = await res.json();
    return response;
  };

  const tokens = await getData();
  const { accessToken, refreshToken } = tokens;
  const keyString = envVar.AUTH_SECRET;
  const keyData = Uint8Array.from(atob(keyString), (c) => c.charCodeAt(0));
  const encryptionKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    'AES-GCM',
    true,
    ['encrypt', 'decrypt']
  );
  const iv = new Uint8Array(envVar.AUTH_IV);
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

  if (accessToken && refreshToken) {
    cookies().set('dp_access_token', encryptedTokenString, {
      httpOnly: true,
    });
    cookies().set('dp_refresh_token', encryptedRefreshTokenString, {
      httpOnly: true,
    });
  }
}
