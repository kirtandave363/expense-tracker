import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/auth";

export async function proxy(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    // Public routes that don't need authentication
    const publicRoutes = ['/login', '/signup'];
    const isPublicRoute = publicRoutes.includes(pathname);

    // Protected routes that need authentication
    const protectedRoutes = ['/dashboard'];
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    // If user has token and tries to access login/signup, redirect to dashboard
    if (token && isPublicRoute) {
        const user = await verifyToken(token);

        if (user) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }

    // If user doesn't have token and tries to access protected route, redirect to login
    if (!token && isProtectedRoute) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // If user has invalid token on protected route, redirect to login
    if (token && isProtectedRoute) {
        const user = verifyToken(token);
        if (!user) {
            const response = NextResponse.redirect(new URL('/login', request.url));
            response.cookies.delete('token');
            return response;
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/login', '/signup']
}