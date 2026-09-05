import { NextResponse, type NextRequest } from 'next/server';
import { readSessionToken, SESSION_COOKIE } from '@/lib/auth';

/**
 * Two jobs.
 *
 * 1. Language routing. English is served from the root (/henna), Arabic from
 *    /ar/henna. The rewrite keeps the clean English URL in the address bar
 *    while the app renders the [lang] segment underneath.
 * 2. Guarding /admin behind the session cookie.
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') return NextResponse.next();
    const session = await readSessionToken(req.cookies.get(SESSION_COOKIE)?.value);
    if (!session) {
      const url = req.nextUrl.clone();
      url.pathname = '/admin/login';
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (pathname === '/ar' || pathname.startsWith('/ar/')) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = `/en${pathname === '/' ? '' : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|images|favicon.ico|robots.txt|sitemap.xml|manifest.webmanifest|.*\\.).*)'],
};
