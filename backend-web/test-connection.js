const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fashion_db';

console.log('🔍 Testing MongoDB connection...\n');
console.log(`📍 Connecting to: ${MONGODB_URI}\n`);

const testConnection = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });

    console.log('✅ SUCCESS! MongoDB connected successfully\n');
    console.log('📦 Database:', mongoose.connection.name);
    console.log('🌐 Host:', mongoose.connection.host);
    console.log('🔢 Port:', mongoose.connection.port);
    console.log('📊 Ready State:', mongoose.connection.readyState, '(1 = connected)\n');

    // Test creating a collection
    const TestModel = mongoose.model('ConnectionTest', new mongoose.Schema({
      message: String,
      timestamp: { type: Date, default: Date.now }
    }));

    const testDoc = await TestModel.create({
      message: 'Connection test successful!'
    });

    console.log('✅ Test document created:', testDoc._id);

    // Clean up
    await TestModel.deleteOne({ _id: testDoc._id });
    console.log('✅ Test document cleaned up\n');

    console.log('🎉 All tests passed! Your MongoDB is ready to use.\n');

    await mongoose.connection.close();
    console.log('👋 Connection closed');
    process.exit(0);

  } catch (error) {
    console.error('❌ ERROR! Failed to connect to MongoDB\n');
    console.error('Error message:', error.message);
    console.error('\n💡 Possible solutions:');
    console.error('   1. Make sure MongoDB is running:');
    console.error('      - Windows: net start MongoDB');
    console.error('      - Docker: docker start mongodb');
    console.error('      - Mac: brew services start mongodb-community');
    console.error('   2. Check your MONGODB_URI in .env file');
    console.error('   3. Try connecting manually: mongosh\n');
    process.exit(1);
  }
};

testConnection();
