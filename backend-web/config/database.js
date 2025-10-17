const mongoose = require('mongoose');
require('dotenv').config();

// رابط الاتصال الافتراضي لـ MongoDB المحلي
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fashion_db';

// خيارات الاتصال
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
};

// الاتصال بقاعدة البيانات
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, options);
    console.log('✅ MongoDB connected successfully');
    console.log(`📦 Database: ${mongoose.connection.name}`);
    console.log(`🌐 Host: ${mongoose.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('\n💡 Make sure MongoDB is running locally:');
    console.error('   - Windows: Run "mongod" or start MongoDB service');
    console.error('   - Mac/Linux: Run "brew services start mongodb-community" or "sudo systemctl start mongod"');
    console.error('   - Docker: Run "docker run -d -p 27017:27017 --name mongodb mongo:latest"\n');
    process.exit(1);
  }
};

// معالجة أحداث الاتصال
mongoose.connection.on('connected', () => {
  console.log('🔗 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 Mongoose disconnected from MongoDB');
});

// إغلاق الاتصال عند إيقاف التطبيق
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('👋 MongoDB connection closed through app termination');
  process.exit(0);
});

module.exports = connectDB;
