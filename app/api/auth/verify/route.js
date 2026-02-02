import { verifyAuth } from '@/lib/auth-middleware';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const authResult = await verifyAuth(request);
  
  if (!authResult.authorized) {
    return NextResponse.json(
      { authenticated: false, message: authResult.message },
      { status: authResult.status }
    );
  }

  return NextResponse.json({
    authenticated: true,
    user: authResult.user
  });
}
