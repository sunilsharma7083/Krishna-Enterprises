require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/krishna-enterprises';

// Admin credentials
const adminData = {
  name: 'Krishna Admin',
  email: 'sales@krishnaenterprises.info',
  password: 'Krishna@Admin123',
  phone: '+91-9876543210',
  role: 'admin',
  address: {
    street: 'Main Office',
    city: 'Your City',
    state: 'Your State',
    pincode: '000000'
  }
};

async function seedAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists');
      console.log('\n📧 Admin Email:', adminData.email);
      console.log('🔑 Admin Password:', adminData.password);
      console.log('🔗 Admin Portal URL: http://localhost:3000/admin-portal-ke2025');
    } else {
      // Create admin user
      const admin = new User(adminData);
      await admin.save();
      
      console.log('✅ Admin user created successfully!');
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📧 Admin Email:', adminData.email);
      console.log('🔑 Admin Password:', adminData.password);
      console.log('🔗 Admin Portal URL: http://localhost:3000/admin-portal-ke2025');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    }

    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    
  } catch (error) {
    console.error('❌ Error seeding admin:', error.message);
    process.exit(1);
  }
}

seedAdmin();
