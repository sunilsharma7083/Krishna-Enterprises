const mongoose = require('mongoose');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// ImgBB API Key (free, no signup needed for testing)
const IMGBB_API_KEY = '6d207e02198a847aa98d0a2a901485a5';  // Free public key for testing
const IMGBB_API_URL = 'https://api.imgbb.com/1/upload';

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

async function uploadToImgBB(localPath, productTitle) {
  try {
    console.log(`   📤 Uploading to ImgBB...`);
    
    const formData = new FormData();
    formData.append('key', IMGBB_API_KEY);
    formData.append('image', fs.createReadStream(localPath));
    formData.append('name', productTitle.replace(/[^a-zA-Z0-9]/g, '-'));

    const response = await axios.post(IMGBB_API_URL, formData, {
      headers: formData.getHeaders(),
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });

    if (response.data && response.data.data && response.data.data.url) {
      const imageUrl = response.data.data.url;
      console.log(`   ✅ Uploaded: ${imageUrl.substring(0, 50)}...`);
      return imageUrl;
    }

    return null;
  } catch (error) {
    console.error(`   ❌ ImgBB error:`, error.response?.data?.error?.message || error.message);
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
      
      // Skip if already a cloud URL
      if (localImagePath.startsWith('http://') || localImagePath.startsWith('https://')) {
        console.log(`   ℹ️  Already using cloud URL\n`);
        successCount++;
        continue;
      }

      // Construct full path to local image
      const fullPath = path.join(__dirname, 'backend', localImagePath);
      
      if (!fs.existsSync(fullPath)) {
        console.log(`   ❌ Local file not found: ${fullPath}\n`);
        failCount++;
        continue;
      }

      // Upload to ImgBB
      const cloudUrl = await uploadToImgBB(fullPath, product.title);
      
      if (cloudUrl) {
        // Update product in database
        product.images = [cloudUrl];
        await product.save();
        console.log(`   💾 Database updated\n`);
        successCount++;
      } else {
        failCount++;
      }
      
      // Delay between uploads to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log('=' .repeat(60));
    console.log('\n📊 Upload Summary:');
    console.log(`   ✅ Successful: ${successCount}`);
    console.log(`   ❌ Failed: ${failCount}`);
    console.log(`   📦 Total: ${products.length}\n`);
    
    if (successCount > 0) {
      console.log('🎉 Images are now hosted on ImgBB!');
      console.log('   👉 They will work on both localhost and production\n');
      console.log('💡 Next steps:');
      console.log('   1. Test locally: http://localhost:3000');
      console.log('   2. Push to Git: git add . && git commit -m "Updated to cloud images" && git push');
      console.log('   3. Images will automatically work in production!\n');
    }

    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error);
    mongoose.connection.close();
  }
}

updateProductImages();
