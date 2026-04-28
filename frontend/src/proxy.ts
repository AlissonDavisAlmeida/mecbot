import { type NextRequest, NextResponse } from 'next/server'

const COOKIE_NAME = 'auth-token'
const AUTH_ROUTES = ['/login', '/register']
// Rotas que exigem autenticação — o restante é público (ex: landing, /terms)
const PROTECTED_ROUTES = ['/dashboard', '/chat', '/profile', '/settings']

/**
 * proxy.ts — substitui o middleware.ts no Next.js 16.
 * Roda no runtime Node.js e intercepta todas as requisições de navegação.
 *
 * Regras:
 * - Usuário não autenticado tentando acessar rota protegida → redireciona para /login
 * - Usuário autenticado tentando acessar /login ou /register → redireciona para /
 */
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get(COOKIE_NAME)?.value

  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  )

  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  )

  if (!token && isProtectedRoute) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  /*
   * Aplica o proxy em todas as rotas exceto:
   * - Rotas internas do Next.js (_next/static, _next/image)
   * - favicon.ico
   * - Rotas de API (/api/*)
   */
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
