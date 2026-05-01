import { app } from './app';
import { config } from './config';
import { connectDB } from './db';

connectDB()
  .then(() => {
    try {
      app.listen(config.port, () => {
        console.log(`Server running on port ${config.port}`);
      });
    } catch (error: unknown) {
      console.log(`Failed to start server: ${error}`);
    }
  })
  .catch((error: unknown) => {
    console.log(`Db connection failed: ${error}`);
  });
