const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config({ path: '../.env' });

// Fix products with missing local images
async function fixMissingImages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const products = await Product.find();
    console.log(`\n📦 Total products: ${products.length}`);

    let fixed = 0;
    const fs = require('fs');
    const path = require('path');

    for (const product of products) {
      if (product.images && product.images.length > 0) {
        const imagePath = product.images[0];
        
        // Check if it's a local path (not CDN)
        if (!imagePath.startsWith('http')) {
          // Extract filename
          const filename = imagePath.split('/').pop();
          const fullPath = path.join(__dirname, 'uploads/products', filename);
          
          // Check if file exists
          if (!fs.existsSync(fullPath)) {
            console.log(`\n❌ Missing file for: ${product.title}`);
            console.log(`   Path: ${imagePath}`);
            console.log(`   File: ${filename}`);
            
            // Replace with Unsplash trophy image
            const fallbackImages = [
              'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
              'https://images.unsplash.com/photo-1614292253918-c5c8d5ba1f1c?w=800&q=80',
              'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800&q=80',
              'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800&q=80',
              'https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=800&q=80'
            ];
            
            product.images = [fallbackImages[fixed % fallbackImages.length]];
            await product.save();
            
            console.log(`   ✅ Fixed with: ${product.images[0]}`);
            fixed++;
          } else {
            console.log(`✅ File exists: ${product.title}`);
          }
        } else {
          console.log(`✅ CDN image: ${product.title}`);
        }
      }
    }

    console.log(`\n✅ Fixed ${fixed} products with missing images`);
    console.log('✅ All products now have valid images');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixMissingImages();
