import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';

export interface AuthenticatedRequest extends NextRequest {
    userId: string;
}

type RouteContext = {
    params?: Promise<Record<string, string>>;
}

type AuthenticatedHandler = (
    request: AuthenticatedRequest,
    context?: RouteContext
) => Promise<NextResponse>;

export function withAuth(handler: AuthenticatedHandler) {

    return async (request: NextRequest, context?: any) => {
        try {
            const user = await getUserFromToken();
            if (!user) {
                return NextResponse.json(
                    { error: 'Unauthorized - Invalid token' },
                    { status: 401 }
                );
            }

            // Attach userId to request
            (request as AuthenticatedRequest).userId = user._id;

            // Call the actual handler
            return await handler(request as AuthenticatedRequest, context);
        } catch (error) {
            console.error('Auth middleware error:', error);
            return NextResponse.json(
                { error: 'Internal server error' },
                { status: 500 }
            );
        }
    }
}
