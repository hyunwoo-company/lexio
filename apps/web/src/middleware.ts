import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// /test/* 라우트는 로컬 개발 환경에서만 접근 가능 (mock 화면 미리보기용).
// production(예: Vercel deploy) 또는 외부 host에서 접근하면 404로 응답.
export function middleware(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith('/test')) return NextResponse.next();

  const isDev = process.env.NODE_ENV !== 'production';
  const host = req.headers.get('host') ?? '';
  const isLocalhost = /^(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?$/i.test(host);

  if (isDev || isLocalhost) return NextResponse.next();

  // production + 외부 host → 404
  return NextResponse.rewrite(new URL('/_not-found', req.url));
}

export const config = {
  matcher: ['/test/:path*'],
};
