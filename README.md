# Krishna Enterprises - Trophy E-Commerce Platform

![Krishna Enterprises](https://img.shields.io/badge/Version-1.0.0-yellow)
![License](https://img.shields.io/badge/License-ISC-blue)
![Node](https://img.shields.io/badge/Node-18+-green)

A complete, production-ready e-commerce web application for **Krishna Enterprises** - A premium trophy and awards business in Jaipur, Rajasthan.

**Owner:** Yogesh Sharma  
**Website:** www.krishnaenterprises.info  
**Location:** A-90, Shri Govind Nagar 1st Extension, Niwaru Road, Jhotwara, Jaipur, Rajasthan 302013, India

---

## 🎯 Features

### User Portal (Public)
- ✅ Responsive homepage with featured products
- ✅ Product categories (Sports Trophies, Corporate Awards, Custom Trophies, Medals, Plaques, Crystal Awards)
- ✅ Product detail pages with multiple images
- ✅ Shopping cart with localStorage persistence
- ✅ Checkout form with customer details
- ✅ WhatsApp integration for instant ordering
- ✅ Search and filter functionality
- ✅ Mobile-first responsive design
- ✅ SEO-friendly structure

### Admin Portal (Protected)
- ✅ Secure login system (username: `admin`, password: `krishna@123`)
- ✅ Dashboard with statistics (total orders, revenue, status breakdown)
- ✅ Product management (Add/Edit/Delete)
- ✅ Multiple image upload support
- ✅ Orders management with status tracking
- ✅ One-click CSV export of all orders
- ✅ Direct WhatsApp communication with customers
- ✅ Real-time order status updates

---

## 🛠️ Tech Stack

### Frontend
- **HTML5** - Semantic markup
- **Tailwind CSS** - Utility-first styling
- **Vanilla JavaScript** - No framework overhead, fast & lightweight
- **Font Awesome** - Icon library
- **SPA Architecture** - Single Page Application for smooth navigation

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database (with Mongoose ODM)
- **Multer** - File upload handling
- **Express Session** - Session management
- **JSON2CSV** - CSV export functionality

---

## 📁 Project Structure

```
Krishana_Expresis/
├── backend/
│   ├── models/
│   │   ├── Product.js          # Product schema
│   │   └── Order.js            # Order schema
│   ├── routes/
│   │   ├── products.js         # Product API routes
│   │   ├── orders.js           # Order API routes
│   │   └── admin.js            # Admin authentication routes
│   ├── uploads/                # Uploaded product images
│   └── server.js               # Express server configuration
├── frontend/
│   ├── admin/
│   │   └── index.html          # Admin portal
│   ├── js/
│   │   ├── app.js              # Main application logic
│   │   ├── cart.js             # Shopping cart functionality
│   │   ├── products.js         # Product listing & details
│   │   ├── orders.js           # Checkout & order placement
│   │   └── admin/
│   │       ├── auth.js         # Admin authentication
│   │       ├── dashboard.js    # Admin dashboard
│   │       ├── products-admin.js  # Product management
│   │       └── orders-admin.js    # Order management
│   └── index.html              # Main user portal
├── .env                        # Environment variables
├── .gitignore                  # Git ignore rules
├── package.json                # Node.js dependencies
└── README.md                   # This file
```

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Free cloud database)
- **Git** (optional) - For version control

### Step 1: Install Dependencies

```bash
cd Krishana_Expresis
npm install
```




### Step 3: Set Up MongoDB

#### Option A: Local MongoDB
1. Install MongoDB on your system
2. Start MongoDB service:
   ```bash
   # macOS (with Homebrew)
   brew services start mongodb-community
   
   # Windows
   # MongoDB runs as a service automatically
   
   # Linux
   sudo systemctl start mongod
   ```

#### Option B: MongoDB Atlas (Recommended for Production)
1. Create free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string and update `MONGODB_URI` in `.env`

### Step 4: Run the Application

#### Development Mode (with auto-restart)
```bash
npm run dev
```

#### Production Mode
```bash
npm start
```

The application will start on **http://localhost:3000**

---

## 📱 Usage Guide

### For Customers (User Portal)

1. **Browse Products**
   - Visit homepage at `http://localhost:3000`
   - Explore categories or search for products
   - View product details and images

2. **Add to Cart**
   - Click "Add to Cart" on any product
   - Adjust quantities in cart
   - Remove items if needed

3. **Checkout**
   - Click "Proceed to Checkout"
   - Fill in delivery details
   - Choose to:
     - Place order via form (saved to database)
     - Order directly via WhatsApp

### For Admin (Admin Portal)

1. **Login**
   - Visit `http://localhost:3000/admin`
   - Username: `admin`


2. **Dashboard**
   - View total orders, revenue, and statistics
   - See recent orders at a glance

3. **Manage Products**
   - Add new products with images
   - Edit existing products
   - Delete products
   - Mark as featured or out of stock

4. **Manage Orders**
   - View all orders
   - Filter by status (New/Processing/Delivered/Cancelled)
   - Update order status
   - Contact customers via WhatsApp
   - Export all orders to CSV

5. **Export Orders**
   - Click "Export to CSV" button
   - Opens spreadsheet with all order details
   - Useful for accounting and record-keeping

---

## 🎨 Customization

### Branding
- **Colors:** Gold (#F59E0B), Black (#111827), White (#FFFFFF)
- **Logo:** Replace trophy icon in navigation
- **Images:** Upload product images via admin panel

### Business Information
Update in `.env` file:
- Phone number
- WhatsApp number
- Email address
- Physical address

### Admin Credentials
Change in `.env` file:
```env
ADMIN_USERNAME=your_username
ADMIN_PASSWORD=your_secure_password
```

---

## 🌐 Deployment

### Option 1: Render.com (Recommended - Free Tier Available)

1. Create account at [Render.com](https://render.com)
2. Create new Web Service
3. Connect your GitHub repository
4. Configure:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment Variables:** Add all from `.env` file
5. Deploy!

### Option 2: Railway.app

1. Create account at [Railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Add MongoDB plugin
4. Add environment variables
5. Deploy!

### Option 3: Vercel + MongoDB Atlas

1. Frontend on [Vercel](https://vercel.com)
2. Backend on separate Node.js hosting
3. MongoDB on [Atlas](https://www.mongodb.com/cloud/atlas)

### Option 4: VPS/Cloud Server (DigitalOcean, AWS, etc.)

1. Set up Ubuntu server
2. Install Node.js and MongoDB
3. Clone repository
4. Run with PM2:
   ```bash
   npm install -g pm2
   pm2 start backend/server.js --name krishna-enterprises
   pm2 startup
   pm2 save
   ```
5. Set up Nginx as reverse proxy
6. Configure SSL with Let's Encrypt

---

## 🔒 Security Best Practices

### Before Going Live:

1. **Change Admin Password**
   ```env
   ADMIN_PASSWORD=use_a_strong_password_here
   ```

2. **Change Session Secret**
   ```env
   SESSION_SECRET=generate_random_secret_key
   ```

3. **Enable HTTPS**
   - Use SSL certificate (Let's Encrypt for free)
   - Update cookie settings in `server.js`

4. **Set Environment to Production**
   ```env
   NODE_ENV=production
   ```

5. **Secure MongoDB**
   - Use MongoDB Atlas with authentication
   - Whitelist only your server IP
   - Use strong database password

6. **Rate Limiting** (Optional but recommended)
   ```bash
   npm install express-rate-limit
   ```

---

## 📊 Database Schema

### Product Model
```javascript
{
  title: String,
  category: String,
  price: Number,
  description: String,
  images: [String],
  inStock: Boolean,
  featured: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Order Model
```javascript
{
  orderNumber: String,
  customerName: String,
  phone: String,
  address: String,
  city: String,
  state: String,
  pincode: String,
  message: String,
  items: [{
    productId: ObjectId,
    title: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  totalAmount: Number,
  status: String,
  orderDate: Date,
  updatedAt: Date
}
```

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Make sure MongoDB is running
```bash
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux
```

### Port Already in Use
```
Error: listen EADDRINUSE :::3000
```
**Solution:** Change port in `.env` or kill process using port 3000

### Images Not Uploading
**Solution:** 
- Check file size (max 5MB per image)
- Verify `backend/uploads/products/` directory exists
- Check file permissions

### Session Not Persisting
**Solution:**
- Clear browser cookies
- Check `SESSION_SECRET` in `.env`
- Restart server

---

## 📞 Support & Contact

**Business Owner:** Yogesh Sharma  
**Phone:** +91 90000 90000  
**Email:** sales@krishnaenterprises.info  
**Address:** A-90, Shri Govind Nagar 1st Extension, Niwaru Road, Jhotwara, Jaipur, Rajasthan 302013, India

For technical issues or customization requests, please contact your developer.

---

## 📝 License

ISC License - Free to use and modify for Krishna Enterprises.

---

## 🎉 Credits

Developed with ❤️ for **Krishna Enterprises**  
Empowering local businesses with modern technology.

---

## 🚀 Future Enhancements (Optional)

- [ ] Email notifications for orders
- [ ] SMS notifications
- [ ] Customer login and order tracking
- [ ] Discount coupons
- [ ] Product reviews and ratings
- [ ] Bulk order quotes
- [ ] Payment gateway integration
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Inventory management

---

**Made with 🏆 for celebrating excellence!**
