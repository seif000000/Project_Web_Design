require('dotenv').config();
const mongoose = require('mongoose');
const Book = require('../models/Book');
const connectDB = require('../config/db');

// Import booksData
// Since booksData.js uses const booksData = [...], we'll use vm to safely evaluate it
const fs = require('fs');
const path = require('path');
const vm = require('vm');

let booksData = [];

try {
    const booksDataPath = path.join(__dirname, '../Books/booksData.js');
    
    // Check if file exists
    if (!fs.existsSync(booksDataPath)) {
        throw new Error(`File not found: ${booksDataPath}`);
    }
    
    // Read the file
    const fileContent = fs.readFileSync(booksDataPath, 'utf8');
    
    // Create a sandbox context
    const sandbox = {
        booksData: null,
        console: console,
        require: require,
        module: { exports: {} },
        exports: {},
        __dirname: path.dirname(booksDataPath),
        __filename: booksDataPath
    };
    
    // Create context
    vm.createContext(sandbox);
    
    // Execute the file - this will set booksData in the sandbox
    vm.runInContext(fileContent, sandbox);
    
    // Extract booksData from sandbox
    booksData = sandbox.booksData;
    
    // If still not found, try wrapping it differently
    if (!Array.isArray(booksData)) {
        // Try wrapping the content to return booksData
        const wrappedCode = `
            let booksData;
            ${fileContent}
            booksData;
        `;
        
        const result = vm.runInNewContext(wrappedCode, {
            console: console,
            require: require
        });
        
        booksData = result;
    }
    
    if (!Array.isArray(booksData)) {
        throw new Error(`booksData is not an array. Type: ${typeof booksData}, Value: ${booksData}`);
    }
    
    console.log(`✅ Loaded ${booksData.length} books from booksData.js`);
} catch (error) {
    console.error('❌ Error loading booksData:', error.message);
    console.error('   File path:', path.join(__dirname, '../Books/booksData.js'));
    console.error('   Make sure Books/booksData.js exists and contains: const booksData = [...]');
    
    // Try alternative: use a simpler eval approach (less safe but works)
    try {
        console.log('   Attempting alternative loading method...');
        const booksDataPath = path.join(__dirname, '../Books/booksData.js');
        const fileContent = fs.readFileSync(booksDataPath, 'utf8');
        
        // Use Function constructor as a safer alternative to eval
        const getBooksData = new Function(`
            ${fileContent}
            return booksData;
        `);
        
        booksData = getBooksData();
        
        if (Array.isArray(booksData)) {
            console.log(`✅ Loaded ${booksData.length} books using alternative method`);
        } else {
            throw new Error('Alternative method returned non-array');
        }
    } catch (altError) {
        console.error('   Alternative method also failed:', altError.message);
        console.error('   Stack:', altError.stack);
        process.exit(1);
    }
}

/**
 * Seed script to populate the database with real books
 * This script reads from booksData.js and populates both MongoDB collections
 * (native driver collection for admin routes and Mongoose collection for new API)
 */

// Function to transform booksData format to database format
function transformBookForDB(book) {
    // Handle title (can be object {en, ar} or string)
    let title = book.title;
    if (typeof title === 'string') {
        title = { en: title, ar: title };
    } else if (!title || typeof title !== 'object') {
        title = { en: '', ar: '' };
    }
    
    // Handle author (can be object {en, ar} or string)
    let author = book.author;
    if (typeof author === 'string') {
        author = { en: author, ar: author };
    } else if (!author || typeof author !== 'object') {
        author = { en: '', ar: '' };
    }
    
    // Handle category (can be object {en, ar} or string)
    let category = book.category;
    if (typeof category === 'string') {
        category = { en: category, ar: category };
    } else if (!category || typeof category !== 'object') {
        category = { en: '', ar: '' };
    }
    
    // Extract genre from category
    const genre = typeof category === 'object' ? category.en : category || '';
    
    return {
        title,
        author,
        category,
        genre,
        price: book.price || 0,
        image_url: book.cover || '',
        coverImageUrl: book.cover || '',
        description: book.description || '',
        isNewArrival: book.isNewArrival || false,
        stock: book.stock || Math.floor(Math.random() * 50) + 10, // Random stock between 10-60
        isAvailable: true,
        rating: book.rating || parseFloat((Math.random() * 2 + 3).toFixed(1)), // Random rating between 3-5
        numberOfPages: book.numberOfPages || Math.floor(Math.random() * 400) + 200 // Random pages between 200-600
    };
}

// Seed function for Mongoose (new API)
async function seedMongooseBooks() {
    try {
        console.log('🌱 Seeding books to Mongoose collection...');
        
        // Clear existing books (optional - comment out if you want to keep existing data)
        // await Book.deleteMany({});
        // console.log('🗑️  Cleared existing books');

        let created = 0;
        let skipped = 0;

        for (const bookData of booksData) {
            const bookDoc = transformBookForDB(bookData);
            
            // Check if book already exists (by title)
            const titleToCheck = typeof bookDoc.title === 'object' ? bookDoc.title.en : bookDoc.title;
            const existingBook = await Book.findOne({
                $or: [
                    { 'title.en': titleToCheck },
                    { title: titleToCheck }
                ]
            });

            if (!existingBook) {
                await Book.create(bookDoc);
                created++;
                console.log(`✅ Created: ${titleToCheck}`);
            } else {
                skipped++;
                console.log(`⏭️  Skipped (already exists): ${titleToCheck}`);
            }
        }

        console.log(`\n📊 Mongoose Seeding Summary:`);
        console.log(`   ✅ Created: ${created} books`);
        console.log(`   ⏭️  Skipped: ${skipped} books`);
        console.log(`   📚 Total in database: ${await Book.countDocuments()}`);
        
        return { created, skipped };
    } catch (error) {
        console.error('❌ Error seeding Mongoose books:', error);
        throw error;
    }
}

// Seed function for native MongoDB driver (admin routes)
async function seedNativeBooks(db) {
    try {
        console.log('\n🌱 Seeding books to native MongoDB collection...');
        
        const booksCollection = db.collection('books');
        
        // Clear existing books (optional)
        // await booksCollection.deleteMany({});
        // console.log('🗑️  Cleared existing books');

        let created = 0;
        let skipped = 0;

        for (const bookData of booksData) {
            const bookDoc = transformBookForDB(bookData);
            bookDoc.createdAt = new Date();
            bookDoc.updatedAt = new Date();
            
            // Check if book already exists
            const titleToCheck = typeof bookDoc.title === 'object' ? bookDoc.title.en : bookDoc.title;
            const existingBook = await booksCollection.findOne({
                $or: [
                    { 'title.en': titleToCheck },
                    { title: titleToCheck }
                ]
            });

            if (!existingBook) {
                await booksCollection.insertOne(bookDoc);
                created++;
                console.log(`✅ Created: ${titleToCheck}`);
            } else {
                skipped++;
                console.log(`⏭️  Skipped (already exists): ${titleToCheck}`);
            }
        }

        console.log(`\n📊 Native MongoDB Seeding Summary:`);
        console.log(`   ✅ Created: ${created} books`);
        console.log(`   ⏭️  Skipped: ${skipped} books`);
        console.log(`   📚 Total in database: ${await booksCollection.countDocuments()}`);
        
        return { created, skipped };
    } catch (error) {
        console.error('❌ Error seeding native MongoDB books:', error);
        throw error;
    }
}

// Main seed function
async function seed() {
    try {
        console.log('🚀 Starting database seeding...\n');

        // Connect to MongoDB using Mongoose
        await connectDB();
        console.log('✅ Connected to MongoDB via Mongoose\n');

        // Seed Mongoose collection
        await seedMongooseBooks();

        // Connect to MongoDB using native driver for admin routes
        const { MongoClient } = require('mongodb');
        const mongoUrl = process.env.MONGODB_URI || process.env.MONGODB_URL || 'mongodb://localhost:27017';
        const dbName = process.env.DB_NAME || 'bookworms_db';
        
        const client = await MongoClient.connect(mongoUrl);
        const db = client.db(dbName);
        console.log('✅ Connected to MongoDB via native driver\n');

        // Seed native collection
        await seedNativeBooks(db);

        // Close native connection
        await client.close();

        console.log('\n✨ Seeding completed successfully!');
        console.log('📖 Your database is now populated with real books.');
        console.log('🌐 You can now access the books via:');
        console.log('   - GET /api/books (New API)');
        console.log('   - GET /admin/books (Admin API)');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

// Run seed if called directly
if (require.main === module) {
    seed();
}

module.exports = { seed, seedMongooseBooks, seedNativeBooks };

