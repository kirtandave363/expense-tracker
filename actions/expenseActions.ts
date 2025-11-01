'use server';

import { revalidatePath } from 'next/cache';
import { requireAuth } from '@/lib/serverActionAuth';
import connectDB from '@/lib/mongodb';
import Expense from '@/models/Expense';
import mongoose from 'mongoose';
import EMI from '@/models/EMI';

// CREATE EXPENSE
export async function createExpenseAction(data: {
    title: string;
    amount: number;
    category: string;
    date?: string;
    description?: string;
}) {
    const user = await requireAuth();

    try {
        await connectDB();

        const { title, amount, category, date, description } = data;

        // Validate required fields
        if (!title || !amount || !category) {
            return { success: false, error: 'Title, amount, and category are required' };
        }

        // Validate amount is a positive number
        if (isNaN(amount) || amount <= 0) {
            return { success: false, error: 'Amount must be a positive number' };
        }

        // Create expense
        await Expense.create({
            userId: user._id,
            title,
            amount: Number(amount),
            category,
            date: date ? new Date(date) : new Date(),
            description: description || '',
        });

        revalidatePath('/dashboard');
        return { success: true };
    } catch (error) {
        console.error('Create expense error:', error);
        return { success: false, error: 'Failed to create expense' };
    }
}

// UPDATE EXPENSE
export async function updateExpenseAction(
    expenseId: string,
    data: {
        title?: string;
        amount?: number;
        category?: string;
        date?: string;
        description?: string;
    }
) {
    const user = await requireAuth();

    try {
        await connectDB();

        if (!mongoose.Types.ObjectId.isValid(expenseId)) {
            return { success: false, error: 'Invalid expense ID' };
        }

        const existingExpense = await Expense.findOne({
            _id: expenseId,
            userId: user._id,
        });

        if (!existingExpense) {
            return { success: false, error: 'Expense not found' };
        }

        const updateData: any = {};
        if (data.title) updateData.title = data.title;
        if (data.amount !== undefined) {
            if (isNaN(data.amount) || data.amount <= 0) {
                return { success: false, error: 'Amount must be a positive number' };
            }
            updateData.amount = Number(data.amount);
        }
        if (data.category) updateData.category = data.category;
        if (data.date) updateData.date = new Date(data.date);
        if (data.description !== undefined) updateData.description = data.description;

        await Expense.findByIdAndUpdate(
            expenseId,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        revalidatePath('/dashboard');
        return { success: true };
    } catch (error) {
        console.error('Update expense error:', error);
        return { success: false, error: 'Failed to update expense' };
    }
}

// DELETE EXPENSE
export async function deleteExpenseAction(expenseId: string) {
    const user = await requireAuth();

    try {
        await connectDB();

        if (!mongoose.Types.ObjectId.isValid(expenseId)) {
            return { success: false, error: 'Invalid expense ID' };
        }

        const deletedExpense = await Expense.findOneAndDelete({
            _id: expenseId,
            userId: user._id,
        });

        if (!deletedExpense) {
            return { success: false, error: 'Expense not found' };
        }

        revalidatePath('/dashboard');
        return { success: true };
    } catch (error) {
        console.error('Delete expense error:', error);
        return { success: false, error: 'Failed to delete expense' };
    }
}

// GET EXPENSES FOR MONTH
export async function getExpensesForMonth(month?: number, year?: number) {
    const user = await requireAuth();

    try {
        await connectDB();

        const now = new Date();
        const targetMonth = month || now.getMonth() + 1;
        const targetYear = year || now.getFullYear();

        if (targetMonth < 1 || targetMonth > 12) {
            throw new Error('Month must be between 1 and 12');
        }

        const startOfMonth = new Date(Date.UTC(targetYear, targetMonth - 1, 1, 0, 0, 0, 0));
        const endOfMonth = new Date(Date.UTC(targetYear, targetMonth, 0, 23, 59, 59, 999));

        // Get all active EMIs
        const activeEMIs = await EMI.find({
            userId: user._id,
            isActive: true,
        });

        // Process EMIs and create expenses if needed
        for (const emi of activeEMIs) {
            const emiStartDate = new Date(emi.startDate);
            const emiEndDate = new Date(emi.endDate);

            if (endOfMonth < emiStartDate || startOfMonth > emiEndDate) {
                continue;
            }

            const daysInMonth = new Date(targetYear, targetMonth, 0).getDate();
            const dayOfMonth = Math.min(emi.dayOfMonth, daysInMonth);
            const emiExpenseDate = new Date(Date.UTC(targetYear, targetMonth - 1, dayOfMonth, 12, 0, 0, 0));

            // Normalize dates to compare only dates, ignoring time
            const emiExpenseDateOnly = new Date(emiExpenseDate.getFullYear(), emiExpenseDate.getMonth(), emiExpenseDate.getDate());
            const emiStartDateOnly = new Date(emiStartDate.getFullYear(), emiStartDate.getMonth(), emiStartDate.getDate());
            const emiEndDateOnly = new Date(emiEndDate.getFullYear(), emiEndDate.getMonth(), emiEndDate.getDate());
            const nowDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            if (
                emiExpenseDateOnly < emiStartDateOnly ||
                emiExpenseDateOnly > emiEndDateOnly ||
                emiExpenseDateOnly > nowDateOnly
            ) {
                continue;
            }

            const existingExpense = await Expense.findOne({
                userId: user._id,
                emiId: emi._id,
                date: { $gte: startOfMonth, $lte: endOfMonth },
            });

            if (!existingExpense) {
                await Expense.create({
                    userId: user._id,
                    title: `${emi.title} (EMI)`,
                    amount: emi.amount,
                    category: 'EMI',
                    date: emiExpenseDate,
                    description: `Auto-generated EMI payment for ${emi.title}`,
                    emiId: emi._id,
                });
            }
        }

        // Fetch all expenses
        const expenses = await Expense.find({
            userId: user._id,
            date: { $gte: startOfMonth, $lte: endOfMonth },
        })
            .sort({ date: 1 })
            .lean();

        // Calculate stats
        const expensesByDate: Record<string, any[]> = {};
        const dailyTotals: Record<number, number> = {};
        let totalAmount = 0;

        expenses.forEach((expense: any) => {
            const dateKey = new Date(expense.date).toISOString().split('T')[0];
            const day = new Date(expense.date).getUTCDate();

            if (!expensesByDate[dateKey]) {
                expensesByDate[dateKey] = [];
            }

            const expenseData = {
                _id: expense._id.toString(),
                title: expense.title,
                amount: expense.amount,
                category: expense.category,
                date: expense.date.toISOString(),
                description: expense.description,
                emiId: expense.emiId ? expense.emiId.toString() : null,
                isEMI: !!expense.emiId,
            };

            expensesByDate[dateKey].push(expenseData);
            totalAmount += expense.amount;
            dailyTotals[day] = (dailyTotals[day] || 0) + expense.amount;
        });

        return {
            month: targetMonth,
            year: targetYear,
            totalExpenses: expenses.length,
            totalAmount,
            expenses: expenses.map((expense: any) => ({
                _id: expense._id.toString(),
                title: expense.title,
                amount: expense.amount,
                category: expense.category,
                date: expense.date.toISOString(),
                description: expense.description,
                emiId: expense.emiId ? expense.emiId.toString() : null,
                isEMI: !!expense.emiId,
            })),
            expensesByDate,
            dailyTotals,
        };
    } catch (error) {
        console.error('Get expenses error:', error);
        throw error;
    }
}