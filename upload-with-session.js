const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const tough = require('tough-cookie');
const {wrapper} = require('axios-cookiejar-support');

// Wrap axios with cookie support
const client = wrapper(axios.create({
  jar: new tough.CookieJar(),
  withCredentials: true
}));

const API_BASE = 'http://localhost:3000/api';
const ADMIN_EMAIL = 'sales@krishnaenterprises.info';
const ADMIN_PASSWORD = 'Krishna@Admin123';

// Product data
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

async function loginAdmin() {
  try {
    console.log('🔐 Logging in as admin...');
    const response = await client.post(`${API_BASE}/admin/login`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    });
    
    console.log('✅ Admin login successful');
    console.log(`   Session established\n`);
    return true;
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data?.message || error.message);
    throw error;
  }
}

async function uploadProduct(product) {
  try {
    console.log(`📤 Uploading: ${product.title}`);
    
    // Check if file exists
    if (!fs.existsSync(product.imagePath)) {
      console.log(`❌ File not found: ${product.imagePath}\n`);
      return false;
    }

    const formData = new FormData();
    formData.append('title', product.title);
    formData.append('description', product.description);
    formData.append('price', product.price.toString());
    formData.append('category', product.category);
    formData.append('inStock', product.inStock.toString());
    formData.append('featured', product.featured.toString());
    formData.append('images', fs.createReadStream(product.imagePath));

    const response = await client.post(`${API_BASE}/products`, formData, {
      headers: {
        ...formData.getHeaders()
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });

    console.log(`✅ Uploaded successfully!`);
    console.log(`   Price: ₹${response.data.data.price}`);
    console.log(`   Category: ${response.data.data.category}\n`);
    return true;
  } catch (error) {
    console.error(`❌ Error uploading ${product.title}:`, error.response?.data?.message || error.message);
    console.log('');
    return false;
  }
}

async function uploadAllProducts() {
  try {
    // Login first
    await loginAdmin();
    
    console.log('📸 Starting product upload process...\n');
    console.log('=' .repeat(60) + '\n');

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < products.length; i++) {
      const success = await uploadProduct(products[i]);
      if (success) {
        successCount++;
      } else {
        failCount++;
      }
      
      // Small delay between uploads
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('=' .repeat(60));
    console.log('\n📊 Upload Summary:');
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Failed: ${failCount}`);
    console.log(`📦 Total: ${products.length}`);
    
    if (successCount > 0) {
      console.log('\n🎉 Products are now available in:');
      console.log('   👉 Admin Portal: http://localhost:3000/admin');
      console.log('   👉 User Portal: http://localhost:3000/');
      console.log('\n💡 Tip: Refresh the pages to see your new products!');
    }

  } catch (error) {
    console.error('❌ Fatal error:', error.message);
  }
}

uploadAllProducts();
