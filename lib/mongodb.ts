import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw Error("Invalid MONGODB_URI")
}

// type defination for cached connection
interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;

}

// extend the global namespace to include mongoose cache
declare global {
    var mongoose: MongooseCache | null
}

// Initialize cache
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB(): Promise<typeof mongoose> {
    if (cached?.conn) {
        return cached.conn;
    }

    if (!cached?.promise) {
        cached!.promise = mongoose.connect(MONGODB_URI!).then((mongoose) => {
            return mongoose
        })
    }

    cached!.conn = await cached!.promise;
    return cached!.conn;
}

export default connectDB