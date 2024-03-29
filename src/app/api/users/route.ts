import { NextResponse } from 'next/server';

export async function GET() {
  const random = Math.floor(Math.random() * 10);
  const getRandomUsers = await fetch(
    `https://randomuser.me/api/?results=${random}`
  );

  const randomUsers = await getRandomUsers.json();

  return NextResponse.json(randomUsers);
}
export const revalidate = 0;
