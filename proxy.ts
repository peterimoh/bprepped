import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { Roles } from '@/lib/types';

export default withAuth(
  function proxy(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Check if the path is an admin route
    if (pathname.startsWith('/admin')) {
      // Check if user has admin or super admin role
      if (
        !token ||
        (token.role !== Roles.Admin && token.role !== Roles.SuperAdmin)
      ) {
        // Redirect to login or unauthorized page
        return NextResponse.redirect(new URL('/login', req.url));
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/builder/:path*',
    '/experiences/:path*',
    '/interview/:path*',
    '/profile/:path*',
    '/resumes/:path*',
    '/scanner/:path*',
    '/settings/:path*',
    '/templates/:path*',
    '/tokens/:path*',
    '/usage/:path*',
  ],
};
