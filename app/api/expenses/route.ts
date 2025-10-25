import { AuthenticatedRequest, withAuth } from "@/lib/apiMiddleware";
import connectDB from "@/lib/mongodb";
import Expense from "@/models/Expense";
import { NextResponse } from "next/server";

async function createExpenseHandler(request: AuthenticatedRequest) {
    try {
        await connectDB();

        const { title, amount, category, date, description } = await request.json();

        // Validate required fields
        if (!title || !amount || !category) {
            return NextResponse.json(
                { error: 'Title, amount, and category are required' },
                { status: 400 }
            );
        }

        // Validate amount is a positive number
        if (isNaN(amount) || amount <= 0) {
            return NextResponse.json(
                { error: 'Amount must be a positive number' },
                { status: 400 }
            );
        }

        // Create expense
        const expense = await Expense.create({
            userId: request.userId,
            title,
            amount: Number(amount),
            category,
            date: date ? new Date(date) : new Date(),
            description: description || '',
        });

        return NextResponse.json(
            {
                message: 'Expense created successfully',
                expense: {
                    id: expense._id,
                    title: expense.title,
                    amount: expense.amount,
                    category: expense.category,
                    date: expense.date,
                    description: expense.description,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Create expense error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// Wrap with authentication middleware
export const POST = withAuth(createExpenseHandler);