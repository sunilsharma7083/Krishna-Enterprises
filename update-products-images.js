// Update all products to have Unsplash image URLs
const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });

const productUpdates = [
  {
    filter: {},
    update: {
      images: ['https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=800&fit=crop']
    },
    title: 'Golden Champion Trophy',
    category: 'Sports Trophies',
    price: 2500,
    description: 'Premium golden trophy perfect for sports championships and competitions.',
    featured: true
  }
];

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    
    const Product = mongoose.model('Product', require('./backend/models/Product').schema);
    
    // Delete all products
    await Product.deleteMany({});
    console.log('🗑️  Deleted all existing products');
    
    // Add new products with Unsplash URLs
    const newProducts = [
      {
        title: 'Golden Champion Trophy',
        category: 'Sports Trophies',
        price: 2500,
        description: 'Premium golden trophy perfect for sports championships and competitions. Features elegant design with star emblem.',
        images: ['https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=800&fit=crop'],
        featured: true,
        inStock: true
      },
      {
        title: 'Silver Excellence Award',
        category: 'Corporate Awards',
        price: 3500,
        description: 'Prestigious silver award trophy ideal for corporate recognition and employee appreciation.',
        images: ['https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=800&h=800&fit=crop'],
        featured: true,
        inStock: true
      },
      {
        title: 'Victory Cup Trophy',
        category: 'Sports Trophies',
        price: 4500,
        description: 'Classic victory cup design perfect for tournaments and championship events.',
        images: ['https://images.unsplash.com/photo-1622116814671-42d9d5d5dc9f?w=800&h=800&fit=crop'],
        featured: true,
        inStock: true
      },
      {
        title: 'Premium Crystal Award',
        category: 'Corporate Awards',
        price: 5500,
        description: 'Elegant crystal award perfect for executive recognition and milestone celebrations.',
        images: ['https://images.unsplash.com/photo-1623691817281-a73dd4fab538?w=800&h=800&fit=crop'],
        featured: true,
        inStock: true
      },
      {
        title: 'Gold Star Trophy',
        category: 'Sports Trophies',
        price: 3000,
        description: 'Stunning gold star trophy ideal for achievement awards and competitions.',
        images: ['https://images.unsplash.com/photo-1606177455902-e8a37049c1b5?w=800&h=800&fit=crop'],
        featured: false,
        inStock: true
      },
      {
        title: 'Bronze Achievement Medal',
        category: 'Medals',
        price: 800,
        description: 'Quality bronze medal perfect for participation awards and achievement recognition.',
        images: ['https://images.unsplash.com/photo-1591117207239-788bf8de6c3b?w=800&h=800&fit=crop'],
        featured: false,
        inStock: true
      },
      {
        title: 'Executive Achievement Plaque',
        category: 'Corporate Awards',
        price: 2000,
        description: 'Professional achievement plaque perfect for corporate recognition and awards ceremonies.',
        images: ['https://images.unsplash.com/photo-1614292253918-c5c8d5ba1f1c?w=800&h=800&fit=crop'],
        featured: false,
        inStock: true
      },
      {
        title: 'Team Championship Trophy',
        category: 'Sports Trophies',
        price: 6000,
        description: 'Large championship trophy perfect for team sports and tournament winners.',
        images: ['https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&h=800&fit=crop'],
        featured: true,
        inStock: true
      }
    ];
    
    await Product.insertMany(newProducts);
    console.log(`✅ Added ${newProducts.length} products with Unsplash image URLs`);
    
    // Verify
    const products = await Product.find({}).select('title images').limit(3);
    console.log('\n📋 Sample products:');
    products.forEach(p => console.log(`  - ${p.title}: ${p.images[0]}`));
    
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
