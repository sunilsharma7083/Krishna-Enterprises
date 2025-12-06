const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config({ path: '../.env' });

async function diagnose() {
  try {
    console.log('🔍 Diagnosing Admin Login Issue...\n');
    
    // Test MongoDB connection
    console.log('📊 Testing MongoDB Atlas connection...');
    console.log('Connection String:', process.env.MONGODB_URI.replace(/:[^:]*@/, ':****@'));
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Atlas connected successfully!\n');
    
    // Check admin user
    console.log('👤 Checking admin user...');
    const admin = await User.findOne({ email: 'sales@krishnaenterprises.info', role: 'admin' });
    
    if (!admin) {
      console.log('❌ Admin user NOT FOUND in database!');
      console.log('\n💡 Solution: Run the resetAdmin.js script');
      await mongoose.connection.close();
      process.exit(1);
    }
    
    console.log('✅ Admin user found in database');
    console.log('   Email:', admin.email);
    console.log('   Name:', admin.name);
    console.log('   Role:', admin.role);
    console.log('   ID:', admin._id);
    console.log('');
    
    // Test password
    console.log('🔐 Testing password verification...');
    const testPassword = 'Krishna@Admin123';
    const isMatch = await admin.comparePassword(testPassword);
    
    if (isMatch) {
      console.log('✅ Password verification WORKS!');
      console.log(`   Password "${testPassword}" matches the stored hash\n`);
    } else {
      console.log('❌ Password verification FAILED!');
      console.log(`   Password "${testPassword}" does NOT match\n`);
      console.log('💡 Solution: Run the resetAdmin.js script to reset password');
      await mongoose.connection.close();
      process.exit(1);
    }
    
    // Test login logic
    console.log('🧪 Testing login logic...');
    const loginEmail = 'sales@krishnaenterprises.info';
    const loginPassword = 'Krishna@Admin123';
    
    const user = await User.findOne({ 
      email: loginEmail.toLowerCase(), 
      role: 'admin' 
    });
    
    if (!user) {
      console.log('❌ Login would FAIL - User not found');
    } else {
      const passwordMatch = await user.comparePassword(loginPassword);
      if (passwordMatch) {
        console.log('✅ Login logic WORKS - All checks passed!\n');
      } else {
        console.log('❌ Login would FAIL - Password incorrect\n');
      }
    }
    
    // Summary
    console.log('📋 SUMMARY:');
    console.log('═'.repeat(50));
    console.log('✅ Database: Connected');
    console.log('✅ Admin User: Exists');
    console.log('✅ Password: Verified');
    console.log('✅ Login: Should work!');
    console.log('═'.repeat(50));
    console.log('');
    console.log('🎯 CONCLUSION:');
    console.log('The issue is NOT with the database or admin credentials.');
    console.log('The problem is likely:');
    console.log('  1. Render backend not deployed with latest code');
    console.log('  2. Render environment variables not set correctly');
    console.log('  3. CORS or network issues');
    console.log('');
    console.log('📝 NEXT STEPS:');
    console.log('  1. Go to: https://dashboard.render.com/');
    console.log('  2. Find your service: krishna-enterprises-9oup');
    console.log('  3. Check "Environment" tab has MONGODB_URI set');
    console.log('  4. Click "Manual Deploy" → "Deploy latest commit"');
    console.log('  5. Wait 2-5 minutes for deployment');
    console.log('  6. Check logs for "MongoDB Connected Successfully"');
    console.log('');
    
    await mongoose.connection.close();
    process.exit(0);
    
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.log('');
    console.log('💡 This error means:');
    if (error.message.includes('ECONNREFUSED') || error.message.includes('connection')) {
      console.log('  → Cannot connect to MongoDB');
      console.log('  → Check MONGODB_URI in .env file');
    } else if (error.message.includes('authentication failed')) {
      console.log('  → MongoDB credentials are wrong');
      console.log('  → Check username/password in connection string');
    } else {
      console.log('  → ', error.message);
    }
    process.exit(1);
  }
}

diagnose();
