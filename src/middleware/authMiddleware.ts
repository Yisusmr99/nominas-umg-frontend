import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { hasAccess } from './roleMiddleware'

// Rutas que no requieren autenticación
const publicRoutes = ['/auth/login', '/register', '/forgot-password']

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')
  const isPublicRoute = publicRoutes.some(route => request.nextUrl.pathname.includes(route))
  const path = request.nextUrl.pathname

  // Handle public routes
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Check role-based access
  if (!isPublicRoute && !hasAccess(path)) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}