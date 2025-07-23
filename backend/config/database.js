import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB with URI:', process.env.MONGODB_URI);
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log('Database name:', conn.connection.name);
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB:`);
    console.error('Error details:', error);
    console.error('Connection string used:', process.env.MONGODB_URI);
    process.exit(1);
  }
};

export default connectDB; 