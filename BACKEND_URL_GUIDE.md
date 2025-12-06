# 🔧 Backend URL Configuration Guide

## 📍 Where to Change Backend URL in Frontend

### Current Configuration:
The backend URL is currently set to `/api` which is a **relative URL**. This means:
- When running locally: `http://localhost:3000/api`
- When deployed: `https://yourdomain.com/api`

---

## 🎯 Files to Update:

### 1. **Main App** - `/frontend/js/app.js`
**Line 2:**
```javascript
const API_BASE = '/api';
```

**Change to** (for production):
```javascript
const API_BASE = 'https://your-backend-domain.com/api';
// OR for different port
const API_BASE = 'http://localhost:5000/api';
```

---

### 2. **Admin Auth** - `/frontend/js/admin/auth.js`
**Line 2:**
```javascript
const API_BASE = '/api';
```

**Change to:**
```javascript
const API_BASE = 'https://your-backend-domain.com/api';
```

---

### 3. **Categories Admin** - `/frontend/js/admin/categories-admin.js`
**Lines 10, 140-141, 180:**
```javascript
const response = await fetch('/api/categories/all', {
```

**Change to:**
```javascript
const response = await fetch('https://your-backend-domain.com/api/categories/all', {
```

⚠️ **NOTE**: This file has hardcoded URLs, needs updating in multiple places:
- Line 10: `/api/categories/all`
- Line 140-141: `/api/categories/${editingCategoryId}` and `/api/categories`
- Line 180: `/api/categories/${categoryId}`

---

## 🚀 Best Practice Solution:

### Create a Config File:

**Option 1: Create `/frontend/js/config.js`**

```javascript
// Configuration for different environments
const CONFIG = {
  development: {
    API_BASE: '/api',
    BACKEND_URL: 'http://localhost:3000'
  },
  production: {
    API_BASE: 'https://your-production-backend.com/api',
    BACKEND_URL: 'https://your-production-backend.com'
  }
};

// Automatically detect environment
const ENV = window.location.hostname === 'localhost' ? 'development' : 'production';

// Export config
const API_BASE = CONFIG[ENV].API_BASE;
const BACKEND_URL = CONFIG[ENV].BACKEND_URL;
```

Then in `/frontend/index.html`, add **BEFORE** all other scripts:
```html
<script src="/js/config.js"></script>
```

---

## 📝 Quick Change Instructions:

### For Production Deployment:

1. **Find all files with `API_BASE`:**
   - `/frontend/js/app.js` (line 2)
   - `/frontend/js/admin/auth.js` (line 2)

2. **Change from:**
   ```javascript
   const API_BASE = '/api';
   ```

3. **Change to:**
   ```javascript
   const API_BASE = 'https://your-backend-url.com/api';
   ```

4. **Also fix hardcoded URLs in:**
   - `/frontend/js/admin/categories-admin.js`
   
   Replace all instances of:
   - `'/api/categories/all'` → `'${API_BASE}/categories/all'`
   - `'/api/categories'` → `'${API_BASE}/categories'`
   - `'/api/categories/${...}'` → `'${API_BASE}/categories/${...}'`

---

## 🔍 Complete List of Files Using API:

### Main Frontend:
1. ✅ `/frontend/js/app.js` - Has `API_BASE`
2. ✅ `/frontend/js/products.js` - Uses `API_BASE`
3. ✅ `/frontend/js/orders.js` - Uses `API_BASE`
4. ✅ `/frontend/js/cart.js` - No API calls (uses localStorage)
5. ✅ `/frontend/js/auth-user.js` - Uses `API_BASE` (needs to be added!)

### Admin Frontend:
6. ✅ `/frontend/js/admin/auth.js` - Has `API_BASE`
7. ✅ `/frontend/js/admin/dashboard.js` - Uses `API_BASE`
8. ✅ `/frontend/js/admin/products-admin.js` - Uses `API_BASE`
9. ✅ `/frontend/js/admin/orders-admin.js` - Uses `API_BASE`
10. ❌ `/frontend/js/admin/categories-admin.js` - **Hardcoded URLs** (needs fixing!)

---

## ⚠️ Issue Found: Missing API_BASE in auth-user.js

The file `/frontend/js/auth-user.js` uses `${API_BASE}` but doesn't define it!

**Fix Required:**
Add at the top of `/frontend/js/auth-user.js`:
```javascript
const API_BASE = '/api';
```

---

## 🛠️ Automated Fix Script:

Create this script to update all URLs at once:

**`update-backend-url.sh`:**
```bash
#!/bin/bash

# New backend URL
NEW_URL="https://your-backend-domain.com/api"

# Update app.js
sed -i '' "s|const API_BASE = '/api'|const API_BASE = '$NEW_URL'|g" frontend/js/app.js

# Update admin auth.js
sed -i '' "s|const API_BASE = '/api'|const API_BASE = '$NEW_URL'|g" frontend/js/admin/auth.js

# Add API_BASE to auth-user.js if not exists
if ! grep -q "const API_BASE" frontend/js/auth-user.js; then
    sed -i '' "1i\\
const API_BASE = '$NEW_URL';\\
" frontend/js/auth-user.js
fi

echo "✅ Backend URL updated to: $NEW_URL"
```

**Usage:**
```bash
chmod +x update-backend-url.sh
./update-backend-url.sh
```

---

## 🌐 Environment-Specific URLs:

### Development (Local):
```javascript
const API_BASE = '/api';  // or 'http://localhost:3000/api'
```

### Production:
```javascript
const API_BASE = 'https://api.krishnaenterprises.com/api';
```

### Staging:
```javascript
const API_BASE = 'https://staging-api.krishnaenterprises.com/api';
```

---

## 🔐 CORS Configuration:

When using a separate backend domain, update backend CORS:

**In `/backend/server.js`:**
```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:3000',           // Local development
    'https://krishnaenterprises.com',  // Production
    'https://www.krishnaenterprises.com'
  ],
  credentials: true  // Important for sessions!
}));
```

---

## ✅ Testing Checklist:

After changing backend URL:

- [ ] Test login/logout
- [ ] Test product loading
- [ ] Test add to cart
- [ ] Test place order
- [ ] Test admin login
- [ ] Test admin product management
- [ ] Test admin order management
- [ ] Test admin category management
- [ ] Check browser console for CORS errors
- [ ] Verify all images load correctly
- [ ] Test on both desktop and mobile

---

## 📊 Summary:

| File | Line | Current | Need to Change? |
|------|------|---------|-----------------|
| `app.js` | 2 | `const API_BASE = '/api'` | ✅ YES |
| `admin/auth.js` | 2 | `const API_BASE = '/api'` | ✅ YES |
| `auth-user.js` | - | Missing! | ⚠️ ADD |
| `admin/categories-admin.js` | Multiple | Hardcoded `/api/...` | ⚠️ FIX |
| Other files | - | Use `${API_BASE}` | ✅ OK |

---

## 🎯 Recommended Action:

1. **Add API_BASE to auth-user.js**
2. **Fix hardcoded URLs in categories-admin.js**
3. **Create config.js for environment management**
4. **Update CORS settings in backend**
5. **Test thoroughly after changes**

---

**Current Backend:** `http://localhost:3000/api`
**Production Backend:** Update the `API_BASE` constants in the files above
