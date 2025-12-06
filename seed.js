// Seed sample products into the database
const mongoose = require('mongoose');
require('dotenv').config();

// Import Product model
const Product = require('./backend/models/Product');

// Sample products data
const sampleProducts = [
  {
    title: 'Golden Victory Trophy - Large',
    category: 'Sports Trophies',
    price: 2500,
    description: 'Premium golden trophy perfect for sports championships and tournaments. Features a detailed victory figure on top with a sturdy marble base. Height: 18 inches. Includes free engraving.',
    images: [
      'https://images.unsplash.com/photo-1586016527814-a8be82e4a1f4?w=600&h=600&fit=crop'
    ],
    inStock: true,
    featured: true
  },
  {
    title: 'Corporate Excellence Award',
    category: 'Corporate Awards',
    price: 3500,
    description: 'Elegant crystal award for corporate recognition. Perfect for employee appreciation, business achievements, and professional milestones. Comes with premium wooden base and personalized engraving.',
    images: [
      'https://images.unsplash.com/photo-1599930113854-d6d7fd521f10?w=600&h=600&fit=crop'
    ],
    inStock: true,
    featured: true
  },
  {
    title: 'Silver Sports Medal Set',
    category: 'Medals',
    price: 150,
    description: 'Set of 3 silver medals (Gold, Silver, Bronze) with ribbons. Perfect for sports events, competitions, and school activities. Durable metal construction with attractive design.',
    images: [
      'https://images.unsplash.com/photo-1596389962278-7bf86b2ce05b?w=600&h=600&fit=crop'
    ],
    inStock: true,
    featured: false
  },
  {
    title: 'Custom Name Plaque',
    category: 'Plaques',
    price: 800,
    description: 'Personalized wooden plaque with brass engraving plate. Ideal for office doors, desk nameplates, and recognition awards. Available in multiple finishes.',
    images: [
      'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=600&h=600&fit=crop'
    ],
    inStock: true,
    featured: false
  },
  {
    title: 'Crystal Star Award',
    category: 'Crystal Awards',
    price: 4500,
    description: 'Stunning crystal star award that reflects light beautifully. Perfect for top performers, VIP recognition, and special achievements. Includes velvet presentation box.',
    images: [
      'https://images.unsplash.com/photo-1609166214994-502d326fafff?w=600&h=600&fit=crop'
    ],
    inStock: true,
    featured: true
  },
  {
    title: 'Football Trophy - Medium',
    category: 'Sports Trophies',
    price: 1800,
    description: 'Detailed football trophy with golden finish. Features a soccer player figure and ball. Perfect for football tournaments and leagues. Height: 14 inches.',
    images: [
      'https://images.unsplash.com/photo-1595909315417-58de8c4738c4?w=600&h=600&fit=crop'
    ],
    inStock: true,
    featured: false
  },
  {
    title: 'Achievement Shield Trophy',
    category: 'Custom Trophies',
    price: 2200,
    description: 'Classic shield design trophy with customizable center plate. Ideal for academic achievements, competitions, and special recognitions. Premium quality construction.',
    images: [
      'https://images.unsplash.com/photo-1588519102089-4856ae16e5ab?w=600&h=600&fit=crop'
    ],
    inStock: true,
    featured: false
  },
  {
    title: 'Leadership Excellence Plaque',
    category: 'Corporate Awards',
    price: 1500,
    description: 'Premium wooden plaque with brass plate for leadership recognition. Perfect for manager appreciation, team leader awards, and executive recognition.',
    images: [
      'https://images.unsplash.com/photo-1587825140681-eb6d62de3369?w=600&h=600&fit=crop'
    ],
    inStock: true,
    featured: false
  },
  {
    title: 'Chess Championship Trophy',
    category: 'Sports Trophies',
    price: 2000,
    description: 'Elegant chess-themed trophy for chess tournaments and competitions. Features detailed chess pieces and board design. Height: 16 inches.',
    images: [
      'https://images.unsplash.com/photo-1586016527814-a8be82e4a1f4?w=600&h=600&fit=crop'
    ],
    inStock: true,
    featured: false
  },
  {
    title: 'Student Achievement Medal',
    category: 'Medals',
    price: 120,
    description: 'Beautiful medal for student achievements in academics, sports, and extracurricular activities. Comes with colorful ribbon.',
    images: [
      'https://images.unsplash.com/photo-1579165466949-7eea5e58a7b5?w=600&h=600&fit=crop'
    ],
    inStock: true,
    featured: false
  },
  {
    title: 'Running Marathon Trophy',
    category: 'Sports Trophies',
    price: 1900,
    description: 'Dynamic running figure trophy perfect for marathon events and athletics competitions. Golden finish with marble base. Height: 15 inches.',
    images: [
      'https://images.unsplash.com/photo-1595909315417-58de8c4738c4?w=600&h=600&fit=crop'
    ],
    inStock: true,
    featured: false
  },
  {
    title: 'Years of Service Award',
    category: 'Corporate Awards',
    price: 2800,
    description: 'Premium award for employee service recognition. Crystal and wood combination with customizable years of service engraving.',
    images: [
      'https://images.unsplash.com/photo-1599930113854-d6d7fd521f10?w=600&h=600&fit=crop'
    ],
    inStock: true,
    featured: true
  }
];

// Connect to MongoDB and seed data
async function seedDatabase() {
  try {
    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB Connected');

    // Clear existing products (optional - comment out if you want to keep existing data)
    console.log('🗑️  Clearing existing products...');
    await Product.deleteMany({});
    console.log('✅ Existing products cleared');

    // Insert sample products
    console.log('📦 Inserting sample products...');
    const products = await Product.insertMany(sampleProducts);
    console.log(`✅ ${products.length} sample products added successfully!`);

    // Display added products
    console.log('\n📋 Added Products:');
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.title} - ₹${product.price} (${product.category})`);
    });

    console.log('\n🎉 Database seeded successfully!');
    console.log('🚀 You can now start the server with: npm start');
    
    // Close connection
    await mongoose.connection.close();
    console.log('👋 MongoDB connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();
