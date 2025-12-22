const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

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

// Function to copy image file to backend uploads
function copyImageToUploads(sourcePath, productIndex) {
  const uploadsDir = path.join(__dirname, 'backend', 'uploads', 'products');
  
  // Create uploads directory if it doesn't exist
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  
  // Generate filename
  const timestamp = Date.now();
  const randomNum = Math.floor(Math.random() * 10000);
  const ext = path.extname(sourcePath);
  const filename = `product-${timestamp}-${randomNum}${ext}`;
  
  // Copy file
  const destPath = path.join(uploadsDir, filename);
  fs.copyFileSync(sourcePath, destPath);
  
  console.log(`   ✅ Copied to: ${filename}`);
  
  // Return the URL path
  return `/uploads/products/${filename}`;
}

// Product data with local image paths
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
    title: 'Samaj Nagar Mahasamman Award',
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

async function addProductsWithImages() {
  try {
    console.log('🔌 Connecting to MongoDB...\n');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('🗑️  Deleting all existing products...\n');
    await Product.deleteMany({});
    console.log('✅ Deleted all existing products\n');

    console.log('📸 Processing images and creating products...\n');
    console.log('=' .repeat(60) + '\n');

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      
      console.log(`${i + 1}. ${product.title}`);
      
      // Check if image file exists
      if (!fs.existsSync(product.imagePath)) {
        console.log(`   ❌ Image not found: ${product.imagePath}\n`);
        continue;
      }
      
      // Copy image to uploads folder
      const imageUrl = copyImageToUploads(product.imagePath, i);
      
      // Create product in database
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
      console.log(`   💾 Saved to database`);
      console.log(`   🏷️  Price: ₹${product.price} | Category: ${product.category}\n`);
    }

    console.log('=' .repeat(60));
    console.log('\n✅ All products added successfully!\n');
    
    const allProducts = await Product.find();
    console.log(`📊 Total products in database: ${allProducts.length}\n`);
    
    console.log('🎯 Sample products:');
    allProducts.slice(0, 3).forEach(p => {
      console.log(`   - ${p.title}`);
      console.log(`     Image: ${p.images[0]}`);
    });
    
    console.log('\n🎉 Products are now available at:');
    console.log('   👉 Admin Portal: http://localhost:3000/admin');
    console.log('   👉 User Portal: http://localhost:3000/\n');
    console.log('💡 Refresh the pages to see your new products!\n');

    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error);
    mongoose.connection.close();
  }
}

addProductsWithImages();
