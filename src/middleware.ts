import { NextResponse, type NextRequest } from 'next/server';

/**
 * A cheap first pass only: it redirects visitors with no session cookie
 * before a page renders. It deliberately does not validate the cookie — the
 * real check is requireUser() inside the protected layout and inside every
 * server action, which is what a request must pass to read or write data.
 */
export function middleware(request: NextRequest) {
  const hasCookie = Boolean(request.cookies.get('us_session')?.value);
  if (hasCookie) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = '/us/sign-in';
  url.search = '';
  return NextResponse.redirect(url);
}

export const config = {
  // Everything under /us except the two unauthenticated screens and the
  // static files a browser fetches before anyone signs in (the manifest and
  // the home-screen icons, which live in public/us).
  matcher: [
    '/us',
    '/us/((?!sign-in$|sign-in/|claim$|claim/|manifest\.webmanifest$|icon\.svg$|icon-[0-9]+\.png$|apple-icon\.png$).*)',
  ],
};
