import { NextResponse } from 'next/server';

export async function GET(req) {
  // Firebase handles the session management on the client side.
  // This endpoint is now just a redirect.
  return NextResponse.redirect(new URL('/dashboard', req.url));
}
