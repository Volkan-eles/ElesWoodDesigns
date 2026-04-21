import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/** Normalize Turkish / non-ASCII chars to ASCII equivalents */
function normalizeSlug(slug: string): string {
  return slug
    .replace(/ı/g, 'i').replace(/İ/g, 'i')
    .replace(/ğ/g, 'g').replace(/Ğ/g, 'g')
    .replace(/ü/g, 'u').replace(/Ü/g, 'u')
    .replace(/ş/g, 's').replace(/Ş/g, 's')
    .replace(/ö/g, 'o').replace(/Ö/g, 'o')
    .replace(/ç/g, 'c').replace(/Ç/g, 'c');
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // We only care about product and plan paths
  if (pathname.includes('/products/') || pathname.includes('/plans/')) {
    // Decode the pathname in case it's URL-encoded (e.g. %C4%B1 for ı)
    const decodedPath = decodeURIComponent(pathname);
    const normalizedPath = normalizeSlug(decodedPath);

    // If normalization changed the path, we should redirect
    if (normalizedPath !== decodedPath) {
      const url = new URL(normalizedPath + search, request.url);
      
      // Ensure trailing slash if config has it enabled (next.config.ts has trailingSlash: true)
      if (!url.pathname.endsWith('/')) {
        url.pathname += '/';
      }

      return NextResponse.redirect(url, 301);
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/products/:path*', '/plans/:path*'],
};
