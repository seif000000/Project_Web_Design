require('dotenv').config();
const { seedMongooseBooks, seedNativeBooks } = require('./seedBooks');
const { seedUsers } = require('./seedUsers');
const connectDB = require('../config/db');
const { MongoClient } = require('mongodb');

/**
 * Master seed script that seeds both books and users
 */

async function seedAll() {
    try {
        console.log('🚀 Starting complete database seeding...\n');
        console.log('='.repeat(60));

        // Connect to MongoDB using Mongoose
        await connectDB();
        console.log('✅ Connected to MongoDB via Mongoose\n');

        // Seed books first
        console.log('📚 STEP 1: Seeding Books');
        console.log('-'.repeat(60));
        await seedMongooseBooks();

        // Connect to MongoDB using native driver for admin routes
        const mongoUrl = process.env.MONGODB_URI || process.env.MONGODB_URL || 'mongodb://localhost:27017';
        const dbName = process.env.DB_NAME || 'bookworms_db';
        
        const client = await MongoClient.connect(mongoUrl);
        const db = client.db(dbName);
        console.log('✅ Connected to MongoDB via native driver\n');
        
        await seedNativeBooks(db);
        await client.close();

        console.log('\n' + '='.repeat(60) + '\n');

        // Seed users
        console.log('👥 STEP 2: Seeding Users');
        console.log('-'.repeat(60));
        await seedUsers();

        console.log('\n' + '='.repeat(60));
        console.log('\n✨ Complete database seeding finished successfully!');
        console.log('\n📖 Your database now contains:');
        console.log('   - Books: Ready to browse');
        console.log('   - Users: Ready to login');
        console.log('\n🌐 Next steps:');
        console.log('   1. Start server: npm run dev');
        console.log('   2. Visit: http://localhost:3000');
        console.log('   3. Login with admin credentials');
        console.log('\n🔐 Admin Login:');
        console.log('   Email: admin@bookworms.com');
        console.log('   Password: Admin123!');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    seedAll();
}

module.exports = { seedAll };

