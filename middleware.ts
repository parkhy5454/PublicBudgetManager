import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // 1. 세션 만료 체크 (30분)
  // 2. IP 제한 (환경변수 ALLOWED_IPS)
  const allowedIps = process.env.ALLOWED_IPS?.split(',') || [];
  if (allowedIps.length > 0) {
    const ip = req.ip || req.headers.get('x-forwarded-for') || '';
    if (!allowedIps.some(a => ip.includes(a.trim()))) {
      return new NextResponse('IP not allowed', { status: 403 });
    }
  }
  return NextResponse.next();
}
export const config = { matcher: ['/api/:path*', '/dashboard/:path*'] };