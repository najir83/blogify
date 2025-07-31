import mongoose from "mongoose";
const connectDB = async (url) => {
  try {
    await mongoose.connect(url);
    console.log('✅ MongoDB Connected');
  
} catch (e) {
    console.error("❌ MongoDB Connection Failed:", e.message);
    process.exit(1);
  }
};
export default connectDB;
