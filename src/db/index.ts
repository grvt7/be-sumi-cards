import mongoose, { ConnectOptions } from 'mongoose';

import { config } from '@/config';

const clientOptions: ConnectOptions = {
  serverApi: { version: '1', strict: true, deprecationErrors: true },
  maxPoolSize: 10,
  minPoolSize: 2,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

const connectWithRetry = async (retries: number = MAX_RETRIES): Promise<void> => {
  try {
    const connectionInstance = await mongoose.connect(
      `${config.database.url}/${config.database.name}`,
      clientOptions,
    );
    console.log(`✅ MongoDB connected! DB HOST: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error(
      `❌ MongoDB connection failed (attempt ${MAX_RETRIES - retries + 1}/${MAX_RETRIES}):`,
      error,
    );

    if (retries > 1) {
      console.log(`⏳ Retrying in ${RETRY_DELAY}ms...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return connectWithRetry(retries - 1);
    }

    console.error('💥 Max retries reached. Exiting...');
    process.exit(1);
  }
};

const connectDB = async () => {
  await connectWithRetry();

  // Handle connection events
  mongoose.connection.on('error', err => {
    console.error('MongoDB connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected. Attempting to reconnect...');
    connectWithRetry();
  });

  mongoose.connection.on('reconnected', () => {
    console.log('MongoDB reconnected successfully');
  });
};

export { connectDB };
