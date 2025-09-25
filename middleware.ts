import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  console.log('Middleware triggered for:', pathname);
  
  // Check if the request is for admin routes or API routes that need authentication
  const isAdminRoute = pathname.startsWith('/admin');
  const isProtectedApiRoute = pathname.startsWith('/api/posts') && request.method !== 'GET';
  
  if (isAdminRoute || isProtectedApiRoute) {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      // Redirect to login if no token
      if (isAdminRoute) {
        return NextResponse.redirect(new URL('/login', request.url));
      } else {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }
    
    // Verify the token
    const user = verifyToken(token);
    if (!user) {
      // Token is invalid, redirect to login
      if (isAdminRoute) {
        return NextResponse.redirect(new URL('/login', request.url));
      } else {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/posts/:path*'
  ]
};
