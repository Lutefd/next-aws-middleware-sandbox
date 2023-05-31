/* eslint-disable import/prefer-default-export */
/* eslint-disable no-unused-vars */
import { NextResponse } from 'next/server';

export async function GET() {
   const random = Math.floor(Math.random() * 10);
   const getRandomUsers = await fetch(
      `https://randomuser.me/api/?results=${random}`,
   );

   const randomUsers = await getRandomUsers.json();

   return NextResponse.json(randomUsers);
}
