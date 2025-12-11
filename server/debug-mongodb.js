// debug-mongodb.js - Run this to test MongoDB connection independently
require('dotenv').config();
const mongoose = require('mongoose');

console.log('🔧 MongoDB Connection Debugger');
console.log('================================\n');

// Check environment variables
console.log('1️⃣  Environment Variables:');
console.log(`   NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`   MONGO_URI: ${process.env.MONGO_URI ? '✅ Set' : '❌ NOT SET'}`);
if (process.env.MONGO_URI) {
    // Hide password in logs
    const uriParts = process.env.MONGO_URI.split('@');
    console.log(`   URI Preview: ${uriParts[0]}@...`);
}
console.log();

// Test connection
const testConnection = async () => {
    try {
        console.log('2️⃣  Testing MongoDB Connection...');
        
        // Enable mongoose debug logging
        mongoose.set('debug', true);
        
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        console.log('\n✅ SUCCESS! MongoDB Connected');
        console.log(`   Host: ${conn.connection.host}`);
        console.log(`   Database: ${conn.connection.name}`);
        console.log(`   Port: ${conn.connection.port}`);
        console.log(`   Ready State: ${conn.connection.readyState}`);
        
        // List collections
        console.log('\n3️⃣  Available Collections:');
        const collections = await conn.connection.db.listCollections().toArray();
        if (collections.length === 0) {
            console.log('   (No collections yet - database is empty)');
        } else {
            collections.forEach(col => {
                console.log(`   - ${col.name}`);
            });
        }
        
        await mongoose.connection.close();
        console.log('\n✅ Connection closed successfully');
        process.exit(0);

    } catch (error) {
        console.log('\n❌ Connection Failed');
        console.log(`   Error: ${error.message}`);
        console.log(`   Code: ${error.code}`);
        console.log(`   Name: ${error.name}`);
        console.log('\n📋 Full Error Details:');
        console.error(error);
        
        console.log('\n💡 Troubleshooting Tips:');
        console.log('   1. Make sure MongoDB is running locally or Atlas is accessible');
        console.log('   2. Check your internet connection for Atlas connections');
        console.log('   3. Verify MONGO_URI in .env file is correct');
        console.log('   4. If using Atlas, check IP whitelist and credentials');
        
        process.exit(1);
    }
};

testConnection();
