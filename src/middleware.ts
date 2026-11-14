import { NextResponse, type NextRequest } from 'next/server';

/**
 * Two cheap passes in front of the private app.
 *
 * 1. Force HTTPS. The session cookie is Secure, so it would never travel over
 *    http anyway — but the sign-in form would, and that is a password in
 *    clear. Cloudflare's zone-wide "Always Use HTTPS" is the better place for
 *    this; doing it here as well means /us is safe regardless of that setting.
 * 2. Redirect visitors with no session cookie. This deliberately does not
 *    validate the cookie: the real check is requireUser() in the protected
 *    layout and in every server action, which is what a request must pass to
 *    read or write anything.
 */

/** Reachable without a session. */
const OPEN_PATHS = new Set(['/us/sign-in', '/us/claim']);

/** Static files a browser fetches before anyone has signed in. */
function isPublicFile(pathname: string): boolean {
  return (
    pathname === '/us/manifest.webmanifest' ||
    pathname === '/us/icon.svg' ||
    pathname === '/us/apple-icon.png' ||
    /^\/us\/icon-\d+\.png$/.test(pathname)
  );
}

/**
 * Only ever returns true when the request is *positively known* to be plain
 * http. An unknown scheme is treated as secure so a missing header can never
 * produce a redirect loop.
 */
function isInsecure(request: NextRequest): boolean {
  // `next dev` also sends x-forwarded-proto: http, and there is no https
  // listener on localhost — enforcing there would loop forever.
  if (process.env.NODE_ENV !== 'production') return false;
  const host = request.nextUrl.hostname;
  if (host === 'localhost' || host === '127.0.0.1' || host === '[::1]') return false;

  const visitor = request.headers.get('cf-visitor');
  if (visitor) {
    try {
      return (JSON.parse(visitor) as { scheme?: string }).scheme === 'http';
    } catch {
      // Malformed header — fall through to x-forwarded-proto.
    }
  }
  const forwarded = request.headers.get('x-forwarded-proto');
  if (forwarded) return forwarded.split(',')[0]!.trim() === 'http';
  return false;
}

export function middleware(request: NextRequest) {
  if (isInsecure(request)) {
    const secure = request.nextUrl.clone();
    secure.protocol = 'https:';
    secure.port = '';
    return NextResponse.redirect(secure, 308);
  }

  const { pathname } = request.nextUrl;
  if (OPEN_PATHS.has(pathname) || isPublicFile(pathname)) return NextResponse.next();

  if (request.cookies.get('us_session')?.value) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = '/us/sign-in';
  url.search = '';
  return NextResponse.redirect(url);
}

export const config = {
  // Everything under /us. The handler above decides what is open; keeping the
  // matcher broad means the HTTPS check covers the sign-in and claim forms,
  // which are exactly the requests that carry a password.
  matcher: ['/us', '/us/:path*'],
};
