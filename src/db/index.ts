import mongoose, { ConnectOptions } from 'mongoose';

import { config } from '@/config';

const clientOptions: ConnectOptions = {
  serverApi: { version: '1', strict: true, deprecationErrors: true },
};

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${config.database.url}/${config.database.name}`,
      clientOptions,
    );
    console.log(`MongoDb connected !! DB HOST: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log('MongoDb connection Failed ', error);
    process.exit(1);
  }
};

export { connectDB };
