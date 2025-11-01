import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import { cookies } from 'next/headers';
import connectDB from '@/lib/mongodb';

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
    throw new Error('Please define JWT_SECRET in .env.local');
}

export async function hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
}

export function generateToken(userId: string): string {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

export async function verifyToken(token: string) {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        await connectDB();
        const user = await User.findById(decoded.userId).select('-password');
        return user;
    } catch (error) {
        return null;
    }
}

export async function getUserFromToken() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return null;
        }

        const decoded = await verifyToken(token);
        return decoded;
    } catch (error) {
        console.log("error: ", error)
        return null;
    }
}
