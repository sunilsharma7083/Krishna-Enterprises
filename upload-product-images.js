const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
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
  featured: Boolean
});

const Product = mongoose.model('Product', productSchema);

// Product data with real trophy/award descriptions
const products = [
  {
    title: 'FIFA World Cup Trophy Award',
    description: 'Premium quality FIFA World Cup themed trophy with golden finish. Sponsored by World Cup Association India. Perfect for football tournaments and sports events. Features decorative crystals and elegant design.',
    price: 3500,
    category: 'sports',
    imagePath: '/Users/sunilkumarsharma/Library/Mobile Documents/.Trash/2.jpeg',
    inStock: true,
    featured: true
  },
  {
    title: 'Golden Round Trophy Plaque',
    description: 'Elegant round golden trophy plaque with decorative border. Features reflective golden surface perfect for custom inscriptions. Ideal for corporate awards and recognition ceremonies.',
    price: 2800,
    category: 'corporate',
    imagePath: '/Users/sunilkumarsharma/Library/Mobile Documents/.Trash/3.jpeg',
    inStock: true,
    featured: false
  },
  {
    title: 'Mahila Shakti Samman Award 2025',
    description: 'Special Women Empowerment Day Award 2025 (महिला शक्तिकरण दिवस 2025). Beautiful round trophy with ornate golden border and elegant design. Perfect for women empowerment events and recognition ceremonies.',
    price: 3200,
    category: 'special',
    imagePath: '/Users/sunilkumarsharma/Library/Mobile Documents/.Trash/4.jpeg',
    inStock: true,
    featured: true
  },
  {
    title: 'Samaj Nagar Mahasamman Samman Award',
    description: 'Premium ceremonial award for community honors (श्री नामदेव आर्या सामाजिक विवाह सम्मेलन). Features detailed Hindi inscriptions and golden metallic finish. Perfect for social and cultural events.',
    price: 4200,
    category: 'special',
    imagePath: '/Users/sunilkumarsharma/Library/Mobile Documents/.Trash/5.jpeg',
    inStock: true,
    featured: false
  },
  {
    title: 'Luxury Red Box Trophy Award',
    description: 'Premium trophy presentation in elegant red wooden box with golden round plaque. Features decorative border and reflective surface. Perfect for high-profile awards and special recognitions.',
    price: 3800,
    category: 'corporate',
    imagePath: '/Users/sunilkumarsharma/Library/Mobile Documents/.Trash/7.jpeg',
    inStock: true,
    featured: true
  },
  {
    title: 'Krishna Enterprises Premium Shield',
    description: 'Signature Krishna Enterprises branded trophy shield with peacock motifs and golden finish. Features distinctive wave pattern design and elegant presentation. Perfect for corporate branding and special events.',
    price: 4500,
    category: 'corporate',
    imagePath: '/Users/sunilkumarsharma/Library/Mobile Documents/.Trash/8.jpeg',
    inStock: true,
    featured: true
  },
  {
    title: 'Indo Nepal International Youth Festival Medal',
    description: 'Official commemorative medal for Indo Nepal International Youth Festival 2024. Features ribbon and detailed embossing. Perfect for cultural events and international competitions.',
    price: 1500,
    category: 'sports',
    imagePath: '/Users/sunilkumarsharma/Library/Mobile Documents/.Trash/11.jpeg',
    inStock: true,
    featured: false
  },
  {
    title: 'Tripp Foundation Religious Award',
    description: 'Distinctive shield-shaped religious trophy (त्रिपु फाउण्डेशन) featuring traditional Indian deity artwork and ornate golden border. Perfect for cultural and spiritual recognition ceremonies.',
    price: 3600,
    category: 'special',
    imagePath: '/Users/sunilkumarsharma/Library/Mobile Documents/.Trash/13.jpeg',
    inStock: true,
    featured: false
  },
  {
    title: 'Mahila Sashaktikaran Diwas Trophy Set',
    description: 'Beautiful set of three Women Empowerment Day trophies (महिला सशक्तिकरण दिवस) in graduated sizes. Features decorative crest and elegant golden finish. Perfect for multi-level award ceremonies.',
    price: 5200,
    category: 'special',
    imagePath: '/Users/sunilkumarsharma/Library/Mobile Documents/.Trash/14.jpeg',
    inStock: true,
    featured: true
  },
  {
    title: 'Mahila Samman 2025 Grand Trophy',
    description: 'Large ceremonial Women Honor Award 2025 (महिला सम्मान 2025 - नारी शक्ति, राष्ट्र की शक्ति). Features ornate golden circular design with scroll base. Perfect for prestigious women recognition events.',
    price: 4800,
    category: 'special',
    imagePath: '/Users/sunilkumarsharma/Library/Mobile Documents/.Trash/16.jpeg',
    inStock: true,
    featured: true
  },
  {
    title: 'Championship Trophy Collection',
    description: 'Assorted collection of premium championship trophies in various sizes. Features golden and silver finishes with elegant cup designs. Perfect for sports tournaments and competitive events.',
    price: 6500,
    category: 'sports',
    imagePath: '/Users/sunilkumarsharma/Library/Mobile Documents/.Trash/17.jpeg',
    inStock: true,
    featured: true
  }
];

async function uploadImageToCloudinary(imagePath, productTitle) {
  try {
    console.log(`📤 Uploading: ${productTitle}`);
    
    // Check if file exists
    if (!fs.existsSync(imagePath)) {
      console.log(`❌ File not found: ${imagePath}`);
      return null;
    }

    const result = await cloudinary.uploader.upload(imagePath, {
      folder: 'krishna-products',
      resource_type: 'image',
      transformation: [
        { width: 1200, height: 1200, crop: 'limit' },
        { quality: 'auto' }
      ]
    });

    console.log(`✅ Uploaded: ${result.secure_url}`);
    return result.secure_url;
  } catch (error) {
    console.error(`❌ Error uploading ${productTitle}:`, error.message);
    return null;
  }
}

async function uploadAllProducts() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('🗑️  Deleting all existing products...');
    await Product.deleteMany({});
    console.log('✅ Deleted all existing products\n');

    console.log('📸 Starting image upload process...\n');

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      
      // Upload image to Cloudinary
      const imageUrl = await uploadImageToCloudinary(product.imagePath, product.title);
      
      if (imageUrl) {
        // Create product with Cloudinary URL
        const newProduct = new Product({
          title: product.title,
          description: product.description,
          price: product.price,
          category: product.category,
          images: [imageUrl],
          inStock: product.inStock,
          featured: product.featured
        });

        await newProduct.save();
        console.log(`💾 Saved to database: ${product.title}\n`);
      } else {
        console.log(`⚠️  Skipped: ${product.title} (image upload failed)\n`);
      }
    }

    console.log('\n✅ All products uploaded successfully!');
    console.log('\n📋 Summary:');
    const allProducts = await Product.find();
    console.log(`Total products in database: ${allProducts.length}`);
    
    console.log('\n🎯 Sample products:');
    allProducts.slice(0, 3).forEach(p => {
      console.log(`- ${p.title}: ${p.images[0]}`);
    });

    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error);
    mongoose.connection.close();
  }
}

uploadAllProducts();
