import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { comparePassword, generateToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const { email, password } = await request.json();

        // Validate input
        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        //check user exists
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 400 }
            )
        }

        // check password correct
        const isPasswordCorrect = await comparePassword(password, user.password)

        if (!isPasswordCorrect) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 400 }
            )
        }

        // Generate token
        const token = generateToken(user._id.toString());

        // Create response with cookie
        const response = NextResponse.json(
            { message: 'Login successful', userId: user._id },
            { status: 200 }
        );

        response.cookies.set('token', token);

        return response

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}