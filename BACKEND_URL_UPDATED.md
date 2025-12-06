# ✅ Backend URL Updated to Render Deployment

## 🔄 Changes Made:

### Updated Backend URL From:
```
/api (relative path - localhost)
```

### Updated Backend URL To:
```
https://krishna-enterprises-9oup.onrender.com/api
```

---

## 📝 Files Updated:

### ✅ 1. Admin Authentication
**File:** `/frontend/js/admin/auth.js`
**Line 2:**
```javascript
const API_BASE = 'https://krishna-enterprises-9oup.onrender.com/api';
```

### ✅ 2. Main App
**File:** `/frontend/js/app.js`
**Line 2:**
```javascript
const API_BASE = 'https://krishna-enterprises-9oup.onrender.com/api';
```

### ✅ 3. User Authentication
**File:** `/frontend/js/auth-user.js`
**Line 2 (ADDED):**
```javascript
const API_BASE = 'https://krishna-enterprises-9oup.onrender.com/api';
```

### ✅ 4. Admin Categories (Multiple Lines)
**File:** `/frontend/js/admin/categories-admin.js`

- **Line ~10:** GET categories
  ```javascript
  fetch('https://krishna-enterprises-9oup.onrender.com/api/categories/all', {...})
  ```

- **Lines ~140-141:** POST/PUT categories
  ```javascript
  const url = editingCategoryId 
      ? `https://krishna-enterprises-9oup.onrender.com/api/categories/${editingCategoryId}`
      : 'https://krishna-enterprises-9oup.onrender.com/api/categories';
  ```

- **Line ~180:** DELETE category
  ```javascript
  fetch(`https://krishna-enterprises-9oup.onrender.com/api/categories/${categoryId}`, {...})
  ```

---

## 🌐 Other Files (Already Using API_BASE - No Changes Needed):

These files reference `${API_BASE}` and will automatically use the new URL:

✅ `/frontend/js/products.js` - Uses `${API_BASE}`
✅ `/frontend/js/orders.js` - Uses `${API_BASE}`
✅ `/frontend/js/cart.js` - No API calls (localStorage only)
✅ `/frontend/js/admin/dashboard.js` - Uses `${API_BASE}`
✅ `/frontend/js/admin/products-admin.js` - Uses `${API_BASE}`
✅ `/frontend/js/admin/orders-admin.js` - Uses `${API_BASE}`

---

## 🔐 Important: CORS Configuration

**Make sure your backend on Render has CORS configured!**

In your backend `/backend/server.js`, ensure you have:

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-frontend-domain.com',  // Add your frontend domain here
    'https://krishna-enterprises-9oup.onrender.com'  // Your backend domain
  ],
  credentials: true  // IMPORTANT: For session cookies
}));
```

---

## 🧪 Testing Checklist:

### Test User Frontend:
- [ ] Home page loads
- [ ] Products page loads and displays products
- [ ] Product search works
- [ ] Product details page works
- [ ] Add to cart works
- [ ] Cart page works
- [ ] Place order works
- [ ] User login/register works
- [ ] User profile works

### Test Admin Portal:
- [ ] Admin login works (http://localhost:3000/admin-portal-ke2025)
- [ ] Dashboard loads with statistics
- [ ] Products management works (view/add/edit/delete)
- [ ] Orders management works
- [ ] Categories management works
- [ ] CSV export works

### Check Browser Console:
- [ ] No CORS errors
- [ ] No 403 Forbidden errors
- [ ] API calls returning data
- [ ] Session cookies being sent

---

## 🚨 Potential Issues & Solutions:

### Issue 1: CORS Errors
**Error:** `Access to fetch at 'https://krishna-enterprises-9oup.onrender.com/api/...' from origin 'http://localhost:3000' has been blocked by CORS policy`

**Solution:** Add CORS configuration in backend (see above)

---

### Issue 2: Session Not Working
**Error:** Admin keeps getting logged out or 403 Forbidden

**Solution 1:** Update session configuration in backend:
```javascript
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax' // Important for cross-domain
  }
}));
```

**Solution 2:** Ensure credentials are included in fetch:
```javascript
fetch(url, {
  credentials: 'include',  // This sends cookies
  // ... other options
})
```

---

### Issue 3: Mixed Content (HTTP/HTTPS)
**Error:** Frontend served over HTTPS can't access HTTP backend

**Solution:** Ensure both frontend and backend use HTTPS in production

---

### Issue 4: Slow Initial Load
**Issue:** Render free tier puts services to sleep after inactivity

**Solution:** 
1. First request will be slow (backend waking up)
2. Consider upgrading Render plan
3. Or use a ping service to keep backend awake

---

## 📊 Deployment URLs:

| Service | URL |
|---------|-----|
| **Backend API** | https://krishna-enterprises-9oup.onrender.com/api |
| **Frontend (Local)** | http://localhost:3000 |
| **Admin Portal (Local)** | http://localhost:3000/admin-portal-ke2025 |

---

## 🔄 Rollback Instructions:

If you need to revert back to localhost:

1. Change in `/frontend/js/admin/auth.js`:
   ```javascript
   const API_BASE = '/api';
   ```

2. Change in `/frontend/js/app.js`:
   ```javascript
   const API_BASE = '/api';
   ```

3. Change in `/frontend/js/auth-user.js`:
   ```javascript
   const API_BASE = '/api';
   ```

4. Change in `/frontend/js/admin/categories-admin.js`:
   - Replace all `https://krishna-enterprises-9oup.onrender.com/api` with `/api`

---

## ✅ Summary:

All frontend files have been updated to point to your Render backend deployment at:
**https://krishna-enterprises-9oup.onrender.com/api**

Your frontend can now communicate with the deployed backend on Render!

**Next Steps:**
1. Start your local frontend: `npm start` (if not running)
2. Test all functionality
3. Check browser console for any errors
4. Verify CORS is properly configured on backend
5. Test both user and admin features

---

**Date Updated:** December 6, 2025
**Backend URL:** https://krishna-enterprises-9oup.onrender.com
