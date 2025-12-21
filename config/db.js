const mongoose = require('mongoose');
require('dotenv').config();

/**
 * MongoDB Connection Configuration
 * 
 * This module handles the connection to MongoDB using Mongoose.
 * It supports both local MongoDB and MongoDB Atlas (cloud) connections.
 */

const connectDB = async () => {
    try {
        // Get MongoDB URI from environment variables or use default
        const mongoURI = process.env.MONGODB_URI || process.env.MONGODB_URL || 'mongodb://localhost:27017/bookworms_db';
        
        const conn = await mongoose.connect(mongoURI, {
            // These options are recommended for Mongoose 6+
            // useNewUrlParser and useUnifiedTopology are no longer needed in Mongoose 6+
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📊 Database: ${conn.connection.name}`);
        
        return conn;
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        // Exit process with failure
        process.exit(1);
    }
};

module.exports = connectDB;


