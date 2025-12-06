const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config({ path: '../.env' });

async function resetAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas\n');
    
    // Delete existing admin
    const deleted = await User.deleteOne({ email: 'sales@krishnaenterprises.info' });
    console.log('🗑️  Deleted existing admin:', deleted.deletedCount > 0 ? 'Yes' : 'No\n');
    
    // Create new admin with correct password
    const admin = new User({
      name: 'Krishna Admin',
      email: 'sales@krishnaenterprises.info',
      password: 'Krishna@Admin123',  // Will be hashed automatically
      role: 'admin'
    });
    
    await admin.save();
    console.log('✅ New admin user created!\n');
    
    // Verify password works
    const testAdmin = await User.findOne({ email: 'sales@krishnaenterprises.info' });
    const isMatch = await testAdmin.comparePassword('Krishna@Admin123');
    
    console.log('🔍 Password verification:', isMatch ? '✅ WORKS!' : '❌ FAILED!');
    console.log('\n📧 Admin Email: sales@krishnaenterprises.info');
    console.log('🔑 Admin Password: Krishna@Admin123');
    console.log('🔗 Login URL: https://krishna-enterprises-theta.vercel.app/admin-portal-ke2025\n');
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

resetAdmin();
