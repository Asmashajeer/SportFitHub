import mongoose from 'mongoose';
import dotenv from 'dotenv';



dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || 'mongodb://localhost:27017/Sport_Fitness_db',
    );
    console.log(`MongoDB Connected`);
  } catch (error) {
  
    console.error(`Error: ${error.message}`);
    
    process.exit(1);
  }
};

export default connectDB;
