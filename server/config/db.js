// server/config/db.js

const mongoose = require('mongoose');

// Function to establish the database connection
const connectDB = async () => {
    try {
        // Debug: Show connection attempt
        console.log('🔍 Attempting MongoDB connection...');
        console.log(`📍 Connection URI: ${process.env.MONGODB_URI ? process.env.MONGODB_URI.split('@')[0] + '@...' : 'NOT SET'}`);
        
        // Set mongoose debug mode for detailed logging
        if (process.env.NODE_ENV === 'development') {
            mongoose.set('debug', true);
        }

        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
            socketTimeoutMS: 45000,
        });
        
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📊 Database: ${conn.connection.name}`);
        console.log(`🔌 Connection State: ${conn.connection.readyState}`);
        
        return conn;
    } catch (error) {
        console.error(`❌ MongoDB Connection Error`);
        console.error(`   Message: ${error.message}`);
        console.error(`   Code: ${error.code}`);
        console.error(`   Full Error:`, error);
        
        // Don't exit immediately, allow graceful shutdown
        process.exit(1);
    }
};

module.exports = connectDB;