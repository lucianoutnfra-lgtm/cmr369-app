import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const isLoginPage = request.nextUrl.pathname.startsWith('/login');
  
  // Rutas públicas que no requieren autenticación
  if (
    isLoginPage ||
    request.nextUrl.pathname.startsWith('/api/') || 
    request.nextUrl.pathname.startsWith('/c/') ||
    request.nextUrl.pathname.includes('.') // Archivos estáticos como favicon.ico, _next, etc.
  ) {
    if (isLoginPage && token) {
      return NextResponse.redirect(new URL('/inbox', request.url));
    }
    return NextResponse.next();
  }

  // Rutas protegidas (El resto del dashboard)
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
