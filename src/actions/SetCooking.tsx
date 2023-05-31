'use server';

import { cookies } from 'next/headers';

import { Amplify } from 'aws-amplify';
import awsExports from '@/aws-exports';

Amplify.configure({ ...awsExports, ssr: true });

export async function setCook() {
  const getData = async () => {
    const res = await fetch('http://localhost:3000/api/random', {
      next: {
        revalidate: 1,
      },
    });
    const data = await res.json();
    return data.random;
  };
  const data = await getData();

  cookies().set({
    name: 'access',
    value: data,
    httpOnly: true,
    path: '/',
  });
}
