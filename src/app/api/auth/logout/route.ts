import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: 'Logged out successfully' });
  response.cookies.set('playmiso_auth_token', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });
  response.cookies.set('toyjoy_auth_token', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });
  return response;
}
