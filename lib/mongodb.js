import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  // Graceful handling for Build time or missing URI
  if (!MONGODB_URI) {
    console.warn('⚠️ WARNING: MONGODB_URI is not defined. Database connection skipped (expected during build).');
    return null;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ Connected to MongoDB Atlas');
      return mongoose;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('❌ MongoDB Connection Error:', e);
    // Don't throw during build to prevent crash
    return null;
  }

  return cached.conn;
}

export default dbConnect;
