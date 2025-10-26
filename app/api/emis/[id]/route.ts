import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import EMI from '@/models/EMI';
import { withAuth, AuthenticatedRequest } from '@/lib/apiMiddleware';
import mongoose from 'mongoose';

async function updateEMIHandler(
    request: AuthenticatedRequest,
    context?: { params?: Promise<Record<string, string>> }
) {
    try {
        await connectDB();

        const { id } = await context?.params!;

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: 'Invalid EMI ID' },
                { status: 400 }
            );
        }

        // Get update data
        const body = await request.json();

        // Remove userId if someone tries to update it
        const { userId, ...updateData } = body;

        // Check if EMI exists and belongs to user
        const existingEMI = await EMI.findOne({
            _id: id,
            userId: request.userId,
        });

        if (!existingEMI) {
            return NextResponse.json(
                { error: 'EMI not found' },
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

        // Validate dayOfMonth if provided
        if (updateData.dayOfMonth !== undefined) {
            if (updateData.dayOfMonth < 1 || updateData.dayOfMonth > 31) {
                return NextResponse.json(
                    { error: 'Day of month must be between 1 and 31' },
                    { status: 400 }
                );
            }
            updateData.dayOfMonth = Number(updateData.dayOfMonth);
        }

        // Convert date strings to Date objects if provided
        if (updateData.startDate) {
            updateData.startDate = new Date(updateData.startDate);
        }
        if (updateData.endDate) {
            updateData.endDate = new Date(updateData.endDate);
        }

        const finalStartDate = updateData.startDate || existingEMI.startDate;
        const finalEndDate = updateData.endDate || existingEMI.endDate;

        // Validate that endDate is after startDate
        if (finalEndDate <= finalStartDate) {
            return NextResponse.json(
                { error: 'End date must be after start date' },
                { status: 400 }
            );
        }

        // Update only provided fields
        const updatedEMI = await EMI.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        return NextResponse.json(
            {
                message: 'EMI updated successfully',
                emi: {
                    id: updatedEMI._id,
                    title: updatedEMI.title,
                    amount: updatedEMI.amount,
                    startDate: updatedEMI.startDate,
                    endDate: updatedEMI.endDate,
                    dayOfMonth: updatedEMI.dayOfMonth,
                    isActive: updatedEMI.isActive,
                },
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Update EMI error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}


async function deleteEMIHandler(request: AuthenticatedRequest,
    context?: { params?: Promise<Record<string, string>> }
) {
    try {

        await connectDB();

        const { id } = await context?.params!;

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: 'Invalid EMI ID' },
                { status: 400 }
            );
        }

        // Delete EMI (only if it belongs to the user)
        const deletedEMI = await EMI.findOneAndDelete({
            _id: id,
            userId: request.userId,
        });

        if (!deletedEMI) {
            return NextResponse.json(
                { error: 'EMI not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                message: 'EMI deleted successfully',
                id: deletedEMI._id,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Delete EMI error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export const PATCH = withAuth(updateEMIHandler);
export const DELETE = withAuth(deleteEMIHandler);