import { getUserFromToken } from '@/lib/auth';
import User from '@/models/User';
import { redirect } from 'next/navigation';

export async function requireAuth() {
    const user = await getUserFromToken();

    if (!user) {
        redirect('/login');
    }

    return user;
}
