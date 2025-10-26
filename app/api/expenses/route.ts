import { AuthenticatedRequest, withAuth } from "@/lib/apiMiddleware";
import connectDB from "@/lib/mongodb";
import EMI from "@/models/EMI";
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

// GET expenses with auto EMI creation
async function getExpensesHandler(request: AuthenticatedRequest) {
    try {
        await connectDB();

        // Get month and year from query params
        const { searchParams } = new URL(request.url);
        const monthParam = searchParams.get('month');
        const yearParam = searchParams.get('year');

        // Use current month/year if not provided
        const now = new Date();
        const month = monthParam ? parseInt(monthParam) : now.getMonth() + 1; // 1-12
        const year = yearParam ? parseInt(yearParam) : now.getFullYear();

        // Validate month
        if (month < 1 || month > 12) {
            return NextResponse.json(
                { error: 'Month must be between 1 and 12' },
                { status: 400 }
            );
        }

        // Calculate start and end of the requested month (UTC)
        const startOfMonth = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
        const endOfMonth = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

        // Get all active EMIs for the user
        const activeEMIs = await EMI.find({
            userId: request.userId,
            isActive: true,
        });

        // Process each EMI and create expenses if needed
        for (const emi of activeEMIs) {
            // Check if this month is within EMI period
            const emiStartDate = new Date(emi.startDate);
            const emiEndDate = new Date(emi.endDate);

            // Skip if requested month is before EMI start or after EMI end
            if (endOfMonth < emiStartDate || startOfMonth > emiEndDate) {
                continue;
            }

            // Calculate the EMI expense date for this month
            const daysInMonth = new Date(year, month, 0).getDate();
            const dayOfMonth = Math.min(emi.dayOfMonth, daysInMonth); // Handle 31st in 30-day months
            const emiExpenseDate = new Date(Date.UTC(year, month - 1, dayOfMonth, 12, 0, 0, 0));

            // Check if EMI expense date is within valid range
            // Don't create if:
            // 1. EMI expense date is before EMI start date
            // 2. EMI expense date is after EMI end date
            // 3. EMI expense date is in the future
            if (
                emiExpenseDate < emiStartDate ||
                emiExpenseDate > emiEndDate ||
                emiExpenseDate > now
            ) {
                continue;
            }

            // Check if expense already exists for this EMI in this month
            const existingExpense = await Expense.findOne({
                userId: request.userId,
                emiId: emi._id,
                date: {
                    $gte: startOfMonth,
                    $lte: endOfMonth,
                },
            });

            // Create EMI expense if it doesn't exist
            if (!existingExpense) {
                await Expense.create({
                    userId: request.userId,
                    title: `${emi.title} (EMI)`,
                    amount: emi.amount,
                    category: 'EMI',
                    date: emiExpenseDate,
                    description: `Auto-generated EMI payment for ${emi.title}`,
                    emiId: emi._id,
                });
            }
        }

        // Fetch all expenses for the month (including newly created EMI expenses)
        const expenses = await Expense.find({
            userId: request.userId,
            date: {
                $gte: startOfMonth,
                $lte: endOfMonth,
            },
        })
            .sort({ date: 1 })
            .populate('emiId', 'title'); // Optionally populate EMI details

        // Group expenses by date for daily view
        const expensesByDate: Record<string, any[]> = {};
        let totalAmount = 0;

        expenses.forEach((expense) => {
            const dateKey = expense.date.toISOString().split('T')[0]; // YYYY-MM-DD

            if (!expensesByDate[dateKey]) {
                expensesByDate[dateKey] = [];
            }

            const expenseData = {
                id: expense._id,
                title: expense.title,
                amount: expense.amount,
                category: expense.category,
                date: expense.date,
                description: expense.description,
                emiId: expense.emiId,
                isEMI: !!expense.emiId,
            };

            expensesByDate[dateKey].push(expenseData);
            totalAmount += expense.amount;
        });

        return NextResponse.json(
            {
                month,
                year,
                totalExpenses: expenses.length,
                totalAmount,
                expenses: expenses.map((expense) => ({
                    id: expense._id,
                    title: expense.title,
                    amount: expense.amount,
                    category: expense.category,
                    date: expense.date,
                    description: expense.description,
                    emiId: expense.emiId,
                    isEMI: !!expense.emiId,
                })),
                expensesByDate,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Get expenses error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// Wrap with authentication middleware
export const POST = withAuth(createExpenseHandler);
export const GET = withAuth(getExpensesHandler);