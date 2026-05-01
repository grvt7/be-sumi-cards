import mongoose from 'mongoose';

import { config } from '@/config';

const DB_NAME = 'sumi-db';

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${config.database.url}/${DB_NAME}`);
    console.log(`MongoDb connected !! DB HOST: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log('MongoDb connection Failed ', error);
    process.exit(1);
  }
};

export { connectDB };
