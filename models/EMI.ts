import mongoose, { Document, Schema } from "mongoose";

export interface IEMI extends Document {
    userId: mongoose.Types.ObjectId,
    title: string;
    amount: number;
    startDate: Date;
    endDate: Date;
    dayOfMonth: number;
    isActive: boolean;
}

const EMISchema = new Schema<IEMI>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    dayOfMonth: {
        type: Number,
        required: true,
        min: 1,
        max: 31
    },
    isActive: {
        type: Boolean,
        default: true,
    }
})

export default mongoose.models?.EMI || mongoose.model<IEMI>('EMI', EMISchema)