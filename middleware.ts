import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    // For now, just allow all requests through
    // Authentication is handled by NextAuth in the app routes
    return NextResponse.next();
}

export const config = {
    matcher: ['/hotel/:path*', '/journey-builder'],
};
