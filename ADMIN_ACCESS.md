# Admin Portal Access Guide

## 🔐 Admin Credentials

**Email:** `sales@krishnaenterprises.info`  
**Password:** `Krishna@Admin123`

## 🔗 Admin Portal URL

The admin portal is **NOT linked** from the main website for security purposes.

**Direct Access URL:** http://localhost:3000/admin-portal-ke2025

> ⚠️ **Important:** This URL is hidden and should be kept confidential. Bookmark this URL for easy access.

## 📝 Admin Portal Features

Once logged in, you can:

- ✅ View dashboard with statistics (total products, orders, revenue)
- ✅ Manage products (Add, Edit, Delete)
- ✅ Mark products as "Featured" to display on homepage
- ✅ Manage inventory (Update stock quantities)
- ✅ View all orders with customer details
- ✅ Export orders to CSV file
- ✅ Upload product images

## 🌐 Main Website

The main website (user portal) is accessible at: http://localhost:3000

**Regular Users can:**
- Browse products
- Add to cart
- Login/Signup
- Place orders
- View their profile
- Update their information

## 🔄 Creating Admin User (If Needed)

If you need to recreate the admin user or create additional admins:

```bash
npm run seed-admin
```

## 📁 Project Structure

```
├── backend/
│   ├── models/
│   │   ├── Product.js     # Product schema
│   │   ├── Order.js       # Order schema
│   │   └── User.js        # User schema (both regular users and admins)
│   ├── routes/
│   │   ├── products.js    # Product API routes
│   │   ├── orders.js      # Order API routes
│   │   ├── auth.js        # User authentication routes
│   │   └── admin.js       # Admin authentication routes
│   ├── seedAdmin.js       # Admin user seeding script
│   └── server.js          # Main Express server
├── frontend/
│   ├── admin/
│   │   └── index.html     # Admin portal interface
│   ├── js/
│   │   ├── admin/         # Admin JavaScript files
│   │   └── auth-user.js   # User authentication logic
│   └── index.html         # Main website
└── package.json
```

## 🚀 Quick Start Commands

```bash
# Start the server
npm start

# Start with auto-reload (development)
npm run dev

# Seed sample products
npm run seed

# Create/verify admin user
npm run seed-admin
```

## 🔒 Security Notes

1. The admin portal URL (`/admin-portal-ke2025`) is not linked anywhere on the main website
2. Admin authentication requires both email/password AND admin role verification
3. User sessions expire after 24 hours
4. Passwords are hashed using bcrypt
5. Change the default admin password after first login in production

## 💡 Tips

- Bookmark the admin portal URL for quick access
- Regular users cannot access admin features even if they know the URL
- The admin can manage "Featured" products which appear on the homepage
- Use the CSV export feature to backup order data regularly

---

**Built for:** Krishna Enterprises (www.krishnaenterprises.info)  
**Tech Stack:** Node.js, Express, MongoDB, HTML5, Tailwind CSS, Vanilla JavaScript
