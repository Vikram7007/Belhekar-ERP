
import mongoose from 'mongoose';



const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/belhekar_erp');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    console.warn('\n========================================================================');
    console.warn('WARNING: MongoDB is not connected. The application will start but');
    console.warn('database operations will wait/timeout until MongoDB is started or');
    console.warn('a valid MONGODB_URI is specified in the .env file.');
    console.warn('========================================================================\n');
  }
};

export default connectDB;