const mongoose = require('mongoose');
const Product = require('./models/Product');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '../.env' });

// Restore uploaded images and only use CDN for products without uploads
async function restoreUploadedImages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const products = await Product.find();
    console.log(`\n📦 Total products: ${products.length}`);

    // Get all uploaded files
    const uploadsDir = path.join(__dirname, 'uploads/products');
    const uploadedFiles = fs.existsSync(uploadsDir) ? fs.readdirSync(uploadsDir) : [];
    
    console.log(`\n📁 Found ${uploadedFiles.length} uploaded file(s):`);
    uploadedFiles.forEach(file => {
      const stats = fs.statSync(path.join(uploadsDir, file));
      console.log(`   - ${file} (${Math.round(stats.size / 1024)}KB)`);
    });

    let restored = 0;
    let keptCDN = 0;
    let usedFallback = 0;

    const fallbackImages = [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      'https://images.unsplash.com/photo-1614292253918-c5c8d5ba1f1c?w=800&q=80',
      'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800&q=80',
      'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800&q=80',
      'https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=800&q=80'
    ];

    for (const product of products) {
      const currentImage = product.images && product.images.length > 0 ? product.images[0] : null;
      
      if (!currentImage) {
        // No image at all, use fallback
        product.images = [fallbackImages[usedFallback % fallbackImages.length]];
        await product.save();
        console.log(`\n🔄 ${product.title}: Added fallback CDN image`);
        usedFallback++;
      } else if (currentImage.startsWith('http')) {
        // Already has CDN image
        console.log(`\n✅ ${product.title}: Already has CDN image`);
        keptCDN++;
      } else {
        // Has local path, check if file exists
        const filename = currentImage.split('/').pop();
        const fullPath = path.join(uploadsDir, filename);
        
        if (fs.existsSync(fullPath)) {
          // File exists! Keep it
          console.log(`\n🎉 ${product.title}: Using uploaded image`);
          console.log(`   File: ${filename}`);
          restored++;
        } else {
          // File missing, use fallback
          product.images = [fallbackImages[usedFallback % fallbackImages.length]];
          await product.save();
          console.log(`\n⚠️  ${product.title}: File missing, using fallback`);
          console.log(`   Missing: ${filename}`);
          usedFallback++;
        }
      }
    }

    console.log(`\n\n📊 Summary:`);
    console.log(`   🎉 Restored uploaded images: ${restored}`);
    console.log(`   ✅ Kept existing CDN images: ${keptCDN}`);
    console.log(`   🔄 Used fallback for missing: ${usedFallback}`);
    console.log(`\n✅ All products now have valid images!`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

restoreUploadedImages();
