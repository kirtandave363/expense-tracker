import mongoose, { Schema, Document } from "mongoose";

export interface IUSER extends Document {
    name: string,
    email: string,
    password: string,
    createdAt: Date
}

const UserSchema = new Schema<IUSER>({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.models?.User || mongoose.model<IUSER>('User', UserSchema);