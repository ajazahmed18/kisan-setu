import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const MONGODB_URI = process.env.MONGODB_URI || '';

let isConnected = false;
let connectionError = null;

// Disable Mongoose buffering so operations fail fast if DB is disconnected
mongoose.set('bufferCommands', false);
mongoose.set('strictQuery', false);

export async function connectDB() {
  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!MONGODB_URI) {
    connectionError = 'MONGODB_URI environment variable is not configured';
    console.warn('MongoDB connection notice: MONGODB_URI is not set. Operating in resilient fallback mode.');
    return null;
  }

  try {
    console.log('Connecting to MongoDB Atlas cluster...');

    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 6000,
      maxPoolSize: 10,
      minPoolSize: 2,
      socketTimeoutMS: 45000,
    });

    isConnected = true;
    connectionError = null;
    console.log(`MongoDB Connected successfully to database: ${mongoose.connection.name || 'kisansetu'}`);
    return mongoose.connection;
  } catch (error) {
    isConnected = false;
    // Sanitize error message to prevent leaking any URI or credentials
    connectionError = error.message ? error.message.replace(/mongodb(\+srv)?:\/\/[^\s]+/gi, 'mongodb://[REDACTED]') : 'MongoDB connection error';
    console.warn('MongoDB connection notice (operating with resilient store):', connectionError);
    return null;
  }
}

export function isDbConnected() {
  return mongoose.connection.readyState === 1;
}

export function getDBStatus() {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  const stateIndex = mongoose.connection.readyState;
  return {
    isConnected: stateIndex === 1,
    state: states[stateIndex] || 'disconnected',
    dbName: mongoose.connection.name || 'kisansetu',
    error: connectionError,
  };
}

export default connectDB;
