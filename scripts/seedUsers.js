require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Profile = require('../models/Profile');
const connectDB = require('../config/db');

/**
 * Seed script to populate the database with sample users
 * Creates both regular users and admin users
 */

const sampleUsers = [
    {
        username: 'admin',
        email: 'admin@bookworms.com',
        password: 'Admin123!',
        role: 'admin',
        profile: {
            firstName: 'Admin',
            lastName: 'User',
            bio: 'System administrator for Book Worms platform',
            favoriteGenres: ['Fiction', 'Fantasy', 'Sci-Fi']
        }
    },
    {
        username: 'john_doe',
        email: 'john@example.com',
        password: 'User123!',
        role: 'user',
        profile: {
            firstName: 'John',
            lastName: 'Doe',
            bio: 'Avid reader and book lover',
            favoriteGenres: ['Novels & Stories', 'Fantasy & Sci-Fi']
        }
    },
    {
        username: 'jane_smith',
        email: 'jane@example.com',
        password: 'User123!',
        role: 'user',
        profile: {
            firstName: 'Jane',
            lastName: 'Smith',
            bio: 'Literature enthusiast and movie art collector',
            favoriteGenres: ['Movies & Art', 'Novels & Stories']
        }
    },
    {
        username: 'booklover',
        email: 'booklover@example.com',
        password: 'User123!',
        role: 'user',
        profile: {
            firstName: 'Alex',
            lastName: 'Reader',
            bio: 'Passionate about all genres of books',
            favoriteGenres: ['Fantasy & Sci-Fi', 'Novels & Stories', 'Movies & Art']
        }
    },
    {
        username: 'harry_potter_fan',
        email: 'hp_fan@example.com',
        password: 'User123!',
        role: 'user',
        profile: {
            firstName: 'Sarah',
            lastName: 'Potter',
            bio: 'Huge Harry Potter fan and fantasy book collector',
            favoriteGenres: ['Fantasy & Sci-Fi']
        }
    }
];

async function seedUsers() {
    try {
        console.log('🌱 Seeding users to database...\n');

        let created = 0;
        let skipped = 0;

        for (const userData of sampleUsers) {
            const { profile, ...userFields } = userData;

            // Check if user already exists
            const existingUser = await User.findOne({
                $or: [
                    { email: userFields.email },
                    { username: userFields.username }
                ]
            });

            if (existingUser) {
                skipped++;
                console.log(`⏭️  Skipped (already exists): ${userFields.username} (${userFields.email})`);
                continue;
            }

            // Create user
            const user = await User.create(userFields);
            console.log(`✅ Created user: ${userFields.username} (${userFields.email}) - Role: ${userFields.role}`);

            // Create profile for user
            if (profile) {
                await Profile.create({
                    user: user._id,
                    ...profile
                });
                console.log(`   📝 Profile created for ${userFields.username}`);
            }

            created++;
        }

        console.log(`\n📊 User Seeding Summary:`);
        console.log(`   ✅ Created: ${created} users`);
        console.log(`   ⏭️  Skipped: ${skipped} users`);
        console.log(`   👥 Total users in database: ${await User.countDocuments()}`);
        
        // Display login credentials
        console.log(`\n🔐 Login Credentials:`);
        console.log(`   Admin:`);
        console.log(`     Email: admin@bookworms.com`);
        console.log(`     Password: Admin123!`);
        console.log(`   Regular Users:`);
        console.log(`     Email: john@example.com | Password: User123!`);
        console.log(`     Email: jane@example.com | Password: User123!`);
        console.log(`     Email: booklover@example.com | Password: User123!`);
        console.log(`     Email: hp_fan@example.com | Password: User123!`);
        
        return { created, skipped };
    } catch (error) {
        console.error('❌ Error seeding users:', error);
        throw error;
    }
}

// Main seed function
async function seed() {
    try {
        console.log('🚀 Starting user seeding...\n');

        // Connect to MongoDB
        await connectDB();
        console.log('✅ Connected to MongoDB\n');

        // Seed users
        await seedUsers();

        console.log('\n✨ User seeding completed successfully!');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ User seeding failed:', error);
        process.exit(1);
    }
}

// Run seed if called directly
if (require.main === module) {
    seed();
}

module.exports = { seed, seedUsers };


