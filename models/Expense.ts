import mongoose, { Schema, Document } from "mongoose";

export interface IEXPENSE extends Document {
    userId: mongoose.Types.ObjectId;
    emiId?: mongoose.Types.ObjectId;
    title: string;
    amount: number;
    category: string;
    date: Date;
    description?: string;
}

const ExpenseSchema = new Schema<IEXPENSE>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    emiId: {
        type: Schema.Types.ObjectId,
        ref: 'EMI',
        required: false,
    },
    title: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    description: {
        type: String
    }
})

export default mongoose.models?.Expense || mongoose.model<IEXPENSE>('Expense', ExpenseSchema)