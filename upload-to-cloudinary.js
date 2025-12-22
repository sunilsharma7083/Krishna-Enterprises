const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Configure Cloudinary - try without the extra 'o'
cloudinary.config({
  cloud_name: 'dtg7x9po',  // Removed extra 'o'
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

// Product schema
const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  category: String,
  images: [String],
  inStock: Boolean,
  featured: Boolean,
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);

async function uploadToCloudinary(localPath, productTitle) {
  try {
    console.log(`   📤 Uploading to Cloudinary...`);
    
    const result = await cloudinary.uploader.upload(localPath, {
      folder: 'krishna-enterprises/products',
      resource_type: 'image',
      transformation: [
        { width: 1200, height: 1200, crop: 'limit' },
        { quality: 'auto' }
      ]
    });

    console.log(`   ✅ Cloudinary URL: ${result.secure_url.substring(0, 60)}...`);
    return result.secure_url;
  } catch (error) {
    console.error(`   ❌ Cloudinary error:`, error.message);
    return null;
  }
}

async function updateProductImages() {
  try {
    console.log('🔌 Connecting to MongoDB...\n');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('📸 Fetching products from database...\n');
    const products = await Product.find();
    console.log(`Found ${products.length} products\n`);
    
    console.log('=' .repeat(60) + '\n');

    let successCount = 0;
    let failCount = 0;

    for (let product of products) {
      console.log(`📦 ${product.title}`);
      
      if (!product.images || product.images.length === 0) {
        console.log(`   ⚠️  No images to upload\n`);
        continue;
      }

      const localImagePath = product.images[0];
      
      // Skip if already a Cloudinary URL
      if (localImagePath.startsWith('http://') || localImagePath.startsWith('https://')) {
        console.log(`   ℹ️  Already using cloud URL\n`);
        continue;
      }

      // Construct full path to local image
      const fullPath = path.join(__dirname, 'backend', localImagePath);
      
      if (!fs.existsSync(fullPath)) {
        console.log(`   ❌ Local file not found: ${fullPath}\n`);
        failCount++;
        continue;
      }

      // Upload to Cloudinary
      const cloudUrl = await uploadToCloudinary(fullPath, product.title);
      
      if (cloudUrl) {
        // Update product in database
        product.images = [cloudUrl];
        await product.save();
        console.log(`   💾 Database updated\n`);
        successCount++;
      } else {
        failCount++;
      }
      
      // Small delay between uploads
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('=' .repeat(60));
    console.log('\n📊 Upload Summary:');
    console.log(`   ✅ Successful: ${successCount}`);
    console.log(`   ❌ Failed: ${failCount}`);
    console.log(`   📦 Total: ${products.length}\n`);
    
    if (successCount > 0) {
      console.log('🎉 Images are now on Cloudinary!');
      console.log('   👉 They will work on both localhost and production\n');
      console.log('💡 Next steps:');
      console.log('   1. Test locally: http://localhost:3000');
      console.log('   2. Push to Git: git add . && git commit -m "Updated images" && git push');
      console.log('   3. Deploy to production (Render will auto-deploy)\n');
    }

    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error);
    mongoose.connection.close();
  }
}

updateProductImages();
