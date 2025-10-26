'use server';

import { revalidatePath } from 'next/cache';
import { requireAuth } from '@/lib/serverActionAuth';
import connectDB from '@/lib/mongodb';
import EMI from '@/models/EMI';
import mongoose from 'mongoose';

// CREATE EMI
export async function createEMIAction(data: {
    title: string;
    amount: number;
    startDate: string;
    endDate: string;
    dayOfMonth: number;
}) {
    const user = await requireAuth();

    try {
        await connectDB();

        const { title, amount, startDate, endDate, dayOfMonth } = data;

        if (!title || !amount || !startDate || !endDate || !dayOfMonth) {
            return { success: false, error: 'All fields are required' };
        }

        if (isNaN(amount) || amount <= 0) {
            return { success: false, error: 'Amount must be a positive number' };
        }

        if (dayOfMonth < 1 || dayOfMonth > 31) {
            return { success: false, error: 'Day of month must be between 1 and 31' };
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (end <= start) {
            return { success: false, error: 'End date must be after start date' };
        }

        await EMI.create({
            userId: user._id,
            title,
            amount: Number(amount),
            startDate: start,
            endDate: end,
            dayOfMonth: Number(dayOfMonth),
            isActive: true,
        });

        revalidatePath('/dashboard/emis');
        return { success: true };
    } catch (error) {
        console.error('Create EMI error:', error);
        return { success: false, error: 'Failed to create EMI' };
    }
}

// UPDATE EMI
export async function updateEMIAction(
    emiId: string,
    data: {
        title?: string;
        amount?: number;
        startDate?: string;
        endDate?: string;
        dayOfMonth?: number;
        isActive?: boolean;
    }
) {
    const user = await requireAuth();

    try {
        await connectDB();

        if (!mongoose.Types.ObjectId.isValid(emiId)) {
            return { success: false, error: 'Invalid EMI ID' };
        }

        const existingEMI = await EMI.findOne({
            _id: emiId,
            userId: user._id,
        });

        if (!existingEMI) {
            return { success: false, error: 'EMI not found' };
        }

        const updateData: any = {};
        if (data.title) updateData.title = data.title;
        if (data.amount !== undefined) {
            if (isNaN(data.amount) || data.amount <= 0) {
                return { success: false, error: 'Amount must be a positive number' };
            }
            updateData.amount = Number(data.amount);
        }
        if (data.dayOfMonth !== undefined) {
            if (data.dayOfMonth < 1 || data.dayOfMonth > 31) {
                return { success: false, error: 'Day of month must be between 1 and 31' };
            }
            updateData.dayOfMonth = Number(data.dayOfMonth);
        }
        if (data.startDate) updateData.startDate = new Date(data.startDate);
        if (data.endDate) updateData.endDate = new Date(data.endDate);
        if (data.isActive !== undefined) updateData.isActive = data.isActive;

        // Validate dates
        const finalStartDate = updateData.startDate || existingEMI.startDate;
        const finalEndDate = updateData.endDate || existingEMI.endDate;

        if (finalEndDate <= finalStartDate) {
            return { success: false, error: 'End date must be after start date' };
        }

        await EMI.findByIdAndUpdate(
            emiId,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        revalidatePath('/dashboard/emis');
        return { success: true };
    } catch (error) {
        console.error('Update EMI error:', error);
        return { success: false, error: 'Failed to update EMI' };
    }
}

// DELETE EMI
export async function deleteEMIAction(emiId: string) {
    const user = await requireAuth();

    try {
        await connectDB();

        if (!mongoose.Types.ObjectId.isValid(emiId)) {
            return { success: false, error: 'Invalid EMI ID' };
        }

        const deletedEMI = await EMI.findOneAndDelete({
            _id: emiId,
            userId: user._id,
        });

        if (!deletedEMI) {
            return { success: false, error: 'EMI not found' };
        }

        revalidatePath('/dashboard/emis');
        return { success: true };
    } catch (error) {
        console.error('Delete EMI error:', error);
        return { success: false, error: 'Failed to delete EMI' };
    }
}

// GET ALL EMIs
export async function getAllEMIs() {
    const user = await requireAuth();

    try {
        await connectDB();

        const emis = await EMI.find({ userId: user._id })
            .sort({ createdAt: -1 })
            .lean();

        return {
            emis: emis.map((emi: any) => ({
                _id: emi._id.toString(),
                title: emi.title,
                amount: emi.amount,
                startDate: emi.startDate.toISOString(),
                endDate: emi.endDate.toISOString(),
                dayOfMonth: emi.dayOfMonth,
                isActive: emi.isActive,
            })),
        };
    } catch (error) {
        console.error('Get EMIs error:', error);
        throw error;
    }
}
