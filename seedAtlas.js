// Seed MongoDB Atlas with sample data
const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Category = require('./backend/models/Category');
const Product = require('./backend/models/Product');

const sampleCategories = [
  {
    name: 'Trophies',
    description: 'Championship trophies and victory cups for all occasions',
    icon: 'fa-trophy',
    isActive: true,
    displayOrder: 1
  },
  {
    name: 'Awards',
    description: 'Recognition awards and plaques for achievements',
    icon: 'fa-award',
    isActive: true,
    displayOrder: 2
  },
  {
    name: 'Medals',
    description: 'Sports medals and medallions for winners',
    icon: 'fa-medal',
    isActive: true,
    displayOrder: 3
  },
  {
    name: 'Crystal',
    description: 'Premium crystal awards for special recognition',
    icon: 'fa-gem',
    isActive: true,
    displayOrder: 4
  }
];

const sampleProducts = [
  {
    title: 'Golden Victory Trophy',
    description: 'Premium gold-plated trophy for champions. Perfect for sports tournaments, competitions, and special achievements.',
    price: 1500,
    category: 'Sports Trophies',
    images: [],
    inStock: true,
    featured: true
  },
  {
    title: 'Silver Star Award',
    description: 'Elegant silver award with star design. Ideal for recognizing excellence and outstanding performance.',
    price: 1200,
    category: 'Corporate Awards',
    images: [],
    inStock: true,
    featured: false
  },
  {
    title: 'Crystal Excellence Award',
    description: 'Premium crystal award for excellence. Perfect for corporate events and special recognition.',
    price: 2500,
    category: 'Crystal Awards',
    images: [],
    inStock: true,
    featured: true
  },
  {
    title: 'Bronze Achievement Cup',
    description: 'Classic bronze cup for achievements. Great for sports events and competitions.',
    price: 900,
    category: 'Sports Trophies',
    images: [],
    inStock: true,
    featured: false
  },
  {
    title: 'Gold Medal - 1st Place',
    description: 'Premium gold medal for first place winners. High-quality finish with custom engraving available.',
    price: 250,
    category: 'Medals',
    images: [],
    inStock: true,
    featured: false
  },
  {
    title: 'Silver Medal - 2nd Place',
    description: 'Premium silver medal for second place winners. High-quality finish with custom engraving available.',
    price: 200,
    category: 'Medals',
    images: [],
    inStock: true,
    featured: false
  },
  {
    title: 'Corporate Excellence Plaque',
    description: 'Professional wooden plaque with brass plate. Perfect for corporate awards and recognition.',
    price: 800,
    category: 'Plaques',
    images: [],
    inStock: true,
    featured: true
  },
  {
    title: 'Crystal Star Trophy',
    description: 'Beautiful crystal star trophy with premium finish. Perfect for special achievements.',
    price: 1800,
    category: 'Crystal Awards',
    images: [],
    inStock: true,
    featured: false
  }
];

async function seedDatabase() {
  try {
    console.log('🔗 Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas\n');

    // Seed Categories
    console.log('📂 Checking categories...');
    const categoryCount = await Category.countDocuments();
    
    if (categoryCount === 0) {
      console.log('⬆️  Adding sample categories...');
      await Category.insertMany(sampleCategories);
      console.log(`✅ Added ${sampleCategories.length} categories`);
    } else {
      console.log(`✅ Categories already exist (${categoryCount} found)`);
    }

    // Seed Products
    console.log('\n🏆 Checking products...');
    const productCount = await Product.countDocuments();
    
    if (productCount === 0) {
      console.log('⬆️  Adding sample products...');
      await Product.insertMany(sampleProducts);
      console.log(`✅ Added ${sampleProducts.length} products`);
    } else {
      console.log(`✅ Products already exist (${productCount} found)`);
    }

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Categories: ${await Category.countDocuments()}`);
    console.log(`   Products: ${await Product.countDocuments()}`);
    
    await mongoose.connection.close();
    console.log('\n✅ Connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
}

seedDatabase();
