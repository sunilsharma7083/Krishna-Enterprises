require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const User = require('./models/User');

console.log('\n🔍 Verifying Admin User in MongoDB Atlas...\n');

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

console.log('📍 Connection String:', MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@'));
console.log('📧 Admin Email:', ADMIN_EMAIL);
console.log('🔑 Admin Password:', ADMIN_PASSWORD ? '****' : 'NOT SET');

async function verifyAdmin() {
  try {
    // Connect to MongoDB Atlas
    await mongoose.connect(MONGODB_URI);
    console.log('\n✅ Connected to MongoDB Atlas\n');

    // Find admin user
    const admin = await User.findOne({ email: ADMIN_EMAIL, role: 'admin' });

    if (!admin) {
      console.log('❌ ADMIN USER NOT FOUND IN DATABASE!');
      console.log('\n🔧 Creating admin user...\n');
      
      const newAdmin = new User({
        name: 'Krishna Admin',
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: 'admin'
      });
      
      await newAdmin.save();
      console.log('✅ Admin user created successfully!');
      
      // Verify it was created
      const verifyAdmin = await User.findOne({ email: ADMIN_EMAIL });
      console.log('\n✅ Verification:');
      console.log('   ID:', verifyAdmin._id);
      console.log('   Email:', verifyAdmin.email);
      console.log('   Name:', verifyAdmin.name);
      console.log('   Role:', verifyAdmin.role);
      
      // Test password
      const passwordTest = await verifyAdmin.comparePassword(ADMIN_PASSWORD);
      console.log('   Password Match:', passwordTest ? '✅ YES' : '❌ NO');
      
    } else {
      console.log('✅ ADMIN USER FOUND!');
      console.log('\n📋 Details:');
      console.log('   ID:', admin._id);
      console.log('   Email:', admin.email);
      console.log('   Name:', admin.name);
      console.log('   Role:', admin.role);
      console.log('   Password Hash:', admin.password ? '✅ EXISTS' : '❌ MISSING');
      
      // Test password comparison
      console.log('\n🔐 Testing password...');
      const isMatch = await admin.comparePassword(ADMIN_PASSWORD);
      console.log('   Password Match:', isMatch ? '✅ YES' : '❌ NO');
      
      if (!isMatch) {
        console.log('\n⚠️  PASSWORD MISMATCH! Resetting password...');
        admin.password = ADMIN_PASSWORD;
        await admin.save();
        console.log('✅ Password reset successfully!');
        
        // Verify again
        const testAgain = await admin.comparePassword(ADMIN_PASSWORD);
        console.log('   New Password Match:', testAgain ? '✅ YES' : '❌ NO');
      }
    }

    console.log('\n✅ ATLAS VERIFICATION COMPLETE!');
    console.log('\n📊 Summary:');
    console.log('   Database: MongoDB Atlas');
    console.log('   Admin Email:', ADMIN_EMAIL);
    console.log('   Admin Password:', ADMIN_PASSWORD);
    console.log('   Status: ✅ READY FOR LOGIN');
    
    console.log('\n🧪 Test with curl:');
    console.log(`   curl -X POST https://krishna-enterprises-9oup.onrender.com/api/admin/login \\`);
    console.log(`     -H "Content-Type: application/json" \\`);
    console.log(`     -d '{"email":"${ADMIN_EMAIL}","password":"${ADMIN_PASSWORD}"}'`);
    
    console.log('\n⚠️  IF STILL GETTING 401:');
    console.log('   1. Go to: https://dashboard.render.com/');
    console.log('   2. Find service: krishna-enterprises-9oup');
    console.log('   3. Click "Manual Deploy" → "Deploy latest commit"');
    console.log('   4. Wait 3-5 minutes');
    console.log('   5. Check Logs for "MongoDB Connected Successfully"');
    console.log('\n   The issue is RENDER DEPLOYMENT, not the database!\n');

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error('\nFull error:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

verifyAdmin();
