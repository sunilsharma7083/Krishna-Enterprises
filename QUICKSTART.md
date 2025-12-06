# 🚀 Quick Start Guide - Krishna Enterprises

Get your trophy e-commerce platform up and running in 5 minutes!

## ⚡ Fast Setup (Step-by-Step)

### 1️⃣ Install Node.js
If you don't have Node.js installed:
- Download from: https://nodejs.org/
- Choose LTS version (recommended)
- Install and verify:
  ```bash
  node --version
  npm --version
  ```

### 2️⃣ Install MongoDB

**Option A: MongoDB Atlas (Cloud - Recommended for beginners)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a FREE account
3. Create a FREE cluster (M0 Sandbox)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Open `.env` file and replace `MONGODB_URI` with your connection string
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/krishna-enterprises
   ```

**Option B: Local MongoDB (Advanced users)**
```bash
# macOS (with Homebrew)
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Ubuntu/Debian Linux
sudo apt-get install mongodb

# Windows
Download installer from: https://www.mongodb.com/try/download/community
```

### 3️⃣ Install Dependencies
Open Terminal/Command Prompt in project folder:
```bash
cd Krishana_Expresis
npm install
```

### 4️⃣ Seed Sample Products (Optional but Recommended)
```bash
npm run seed
```
This will add 12 sample trophy products to your database.

### 5️⃣ Start the Server
```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

### 6️⃣ Open in Browser
- **User Website:** http://localhost:3000
- **Admin Portal:** http://localhost:3000/admin

---

## 🔐 Default Admin Login

- **Username:** `admin`
- **Password:** `krishna@123`

⚠️ **IMPORTANT:** Change these credentials in `.env` file before going live!

---

## 🎯 What to Do Next

1. **Login to Admin Panel**
   - Go to http://localhost:3000/admin
   - Login with default credentials
   - Explore the dashboard

2. **Add Your Products**
   - Click "Products" in admin sidebar
   - Click "Add New Product"
   - Upload images and fill details
   - Save!

3. **Customize Business Info**
   - Edit `.env` file
   - Update phone numbers, email, address
   - Restart server

4. **Test Ordering**
   - Go to http://localhost:3000
   - Browse products
   - Add to cart
   - Try checkout
   - Test WhatsApp integration

---

## 📱 WhatsApp Setup

1. Open `.env` file
2. Change this line to your actual WhatsApp number:
   ```
   BUSINESS_WHATSAPP=919000090000
   ```
   (Use country code without + sign)

---

## ❓ Common Issues & Solutions

### Issue: "Cannot connect to MongoDB"
**Solution:**
- Make sure MongoDB is running (local installation)
- Or check MongoDB Atlas connection string is correct
- Verify network connectivity

### Issue: "Port 3000 already in use"
**Solution:**
- Change port in `.env` file:
  ```
  PORT=3001
  ```
- Or kill process using port 3000

### Issue: "npm command not found"
**Solution:**
- Install Node.js from https://nodejs.org/
- Restart terminal after installation

### Issue: Images not uploading
**Solution:**
- Check file size (max 5MB)
- Make sure you're logged in as admin
- Try different image format (JPG, PNG)

---

## 🌐 Deploy to Internet (Free Options)

### Option 1: Render.com (Easiest)
1. Push code to GitHub
2. Go to https://render.com
3. Create new Web Service
4. Connect GitHub repo
5. Add environment variables
6. Deploy!

### Option 2: Railway.app
1. Go to https://railway.app
2. Deploy from GitHub
3. Add MongoDB plugin
4. Deploy!

**Detailed deployment guide:** See main README.md

---

## 📞 Need Help?

- Read full README.md for detailed documentation
- Check troubleshooting section
- Contact: sales@krishnaenterprises.info

---

## ✅ Checklist Before Going Live

- [ ] Changed admin password in `.env`
- [ ] Updated business contact information
- [ ] Added real product images
- [ ] Updated WhatsApp number
- [ ] Tested ordering process
- [ ] Set NODE_ENV=production
- [ ] Secured MongoDB with authentication
- [ ] Set up SSL certificate (HTTPS)
- [ ] Tested on mobile devices
- [ ] Created backups of database

---

**Ready to celebrate excellence! 🏆**
