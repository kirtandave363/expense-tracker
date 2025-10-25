import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Expense from '@/models/Expense';
import { withAuth, AuthenticatedRequest } from '@/lib/apiMiddleware';
import mongoose from 'mongoose';

// UPDATE expense
async function updateExpenseHandler(
    request: AuthenticatedRequest,
    context?: { params?: Promise<Record<string, string>> }
) {
    try {
        await connectDB();

        const { id } = await context?.params!;

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: 'Invalid expense ID' },
                { status: 400 }
            );
        }

        // Get update data
        const body = await request.json();

        // Remove userId if someone tries to update it
        const { userId, ...updateData } = body;

        // Check if expense exists and belongs to user
        const existingExpense = await Expense.findOne({
            _id: id,
            userId: request.userId,
        });

        if (!existingExpense) {
            return NextResponse.json(
                { error: 'Expense not found' },
                { status: 404 }
            );
        }

        // Validate amount if provided
        if (updateData.amount !== undefined) {
            if (isNaN(updateData.amount) || updateData.amount <= 0) {
                return NextResponse.json(
                    { error: 'Amount must be a positive number' },
                    { status: 400 }
                );
            }
            updateData.amount = Number(updateData.amount);
        }

        // Convert date string to Date object if provided
        if (updateData.date) {
            updateData.date = new Date(updateData.date);
        }

        // Update only provided fields
        const updatedExpense = await Expense.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        return NextResponse.json(
            {
                message: 'Expense updated successfully',
                expense: {
                    id: updatedExpense._id,
                    title: updatedExpense.title,
                    amount: updatedExpense.amount,
                    category: updatedExpense.category,
                    date: updatedExpense.date,
                    description: updatedExpense.description,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Update expense error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE expense
async function deleteExpenseHandler(
    request: AuthenticatedRequest,
    context?: { params?: Promise<Record<string, string>> }
) {
    try {
        await connectDB();

        const { id } = await context?.params!;

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: 'Invalid expense ID' },
                { status: 400 }
            );
        }

        // Delete expense (only if it belongs to the user)
        const deletedExpense = await Expense.findOneAndDelete({
            _id: id,
            userId: request.userId,
        });

        if (!deletedExpense) {
            return NextResponse.json(
                { error: 'Expense not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                message: 'Expense deleted successfully',
                id: deletedExpense._id,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Delete expense error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// Wrap with authentication
export const PATCH = withAuth(updateExpenseHandler);
export const DELETE = withAuth(deleteExpenseHandler);
