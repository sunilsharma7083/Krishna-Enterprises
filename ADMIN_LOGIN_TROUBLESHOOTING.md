# 🔧 Admin Login Troubleshooting Guide

## ✅ Server Started Successfully!

**Status:** Server is now running on http://localhost:3000  
**MongoDB:** Connected to Atlas ✅  
**Admin Portal:** http://localhost:3000/admin-portal-ke2025  

---

## 🔐 Login Credentials:

```
Email: sales@krishnaenterprises.info
Password: Krishna@Admin123
```

---

## 📋 Common Issues & Solutions:

### Issue 1: "Server Not Running"
**Symptom:** Cannot access admin portal, connection refused  
**Solution:** 
```bash
cd /Users/sunilkumarsharma/Desktop/Krishana_Expresis
npm start
```
**Keep this terminal running!**

---

### Issue 2: "Invalid credentials or unauthorized access"
**Possible Causes:**

#### A) Wrong API URL in config.js
**Check:** `/frontend/js/config.js`
**Should be:**
```javascript
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3000/api'
  : 'https://krishna-enterprises-9oup.onrender.com/api';
```

#### B) Admin user not in database
**Solution:** Run verification script
```bash
cd /Users/sunilkumarsharma/Desktop/Krishana_Expresis/backend
node verifyAtlasAdmin.js
```

This will:
- Check if admin exists
- Verify password
- Create admin if missing
- Test password comparison

#### C) Browser cache issue
**Solution:** 
- Press **Cmd + Shift + R** (Mac) to hard refresh
- Or clear browser cache
- Or use incognito/private mode

---

### Issue 3: "CORS Error" in browser console
**Symptom:** Error like "blocked by CORS policy"  
**Solution:** Check `/backend/server.js` has:
```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://krishna-enterprises-theta.vercel.app',
    'https://krishna-enterprises-9oup.onrender.com'
  ],
  credentials: true
}));
```

---

### Issue 4: "Session not persisting" / Logged out immediately
**Symptom:** Login succeeds but redirects back to login  
**Check:** `/frontend/js/admin/auth.js` has `credentials: 'include'` in all fetch calls:
```javascript
fetch(`${API_BASE}/admin/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',  // ← Must be here!
  body: JSON.stringify({ email, password })
})
```

---

### Issue 5: MongoDB Connection Error
**Symptom:** Server shows "MongoDB Connection Error"  
**Check:**
1. `.env` file has correct MONGODB_URI
2. MongoDB Atlas allows connections from 0.0.0.0/0
3. Internet connection is working

**Verify MongoDB Atlas:**
1. Go to: https://cloud.mongodb.com/
2. Network Access → Check 0.0.0.0/0 is allowed
3. Database Access → Check user `admin` exists

---

## 🧪 Testing Steps:

### Test 1: Check Server Status
```bash
lsof -ti:3000 && echo "✅ Server running" || echo "❌ Server not running"
```

### Test 2: Test API Endpoint
```bash
curl http://localhost:3000/api/products
```
**Expected:** JSON response with products

### Test 3: Test Login Endpoint
```bash
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"sales@krishnaenterprises.info","password":"Krishna@Admin123"}'
```
**Expected:** `{"success":true,"message":"Login successful",...}`

### Test 4: Verify Admin User
```bash
cd /Users/sunilkumarsharma/Desktop/Krishana_Expresis/backend
node verifyAtlasAdmin.js
```
**Expected:** Shows admin user exists with correct password

### Test 5: Check Browser Console
1. Open admin portal
2. Press **F12** or **Cmd+Option+I**
3. Go to **Console** tab
4. Look for errors (red text)
5. Check **Network** tab for 401/500 errors

---

## 🎯 Current Setup:

### Local Development:
- **Backend:** http://localhost:3000
- **Admin Portal:** http://localhost:3000/admin-portal-ke2025
- **Database:** MongoDB Atlas
- **API Base:** Auto-detected (localhost)

### Production:
- **Frontend:** https://krishna-enterprises-theta.vercel.app
- **Backend:** https://krishna-enterprises-9oup.onrender.com
- **Admin Portal:** https://krishna-enterprises-theta.vercel.app/admin-portal-ke2025
- **API Base:** Auto-detected (Render URL)

---

## 📝 Quick Checklist:

Before trying to login:
- [ ] Server is running (npm start)
- [ ] MongoDB Atlas connected (see server logs)
- [ ] Admin user exists (run verifyAtlasAdmin.js)
- [ ] config.js has auto-detection code
- [ ] Browser cache cleared (Cmd+Shift+R)
- [ ] Using correct email: sales@krishnaenterprises.info
- [ ] Using correct password: Krishna@Admin123

---

## 🚀 Quick Start:

1. **Start Server:**
```bash
cd /Users/sunilkumarsharma/Desktop/Krishana_Expresis
npm start
```

2. **Open Admin Portal:**
- Browser: http://localhost:3000/admin-portal-ke2025
- Or click the Simple Browser tab in VS Code

3. **Login:**
- Email: sales@krishnaenterprises.info
- Password: Krishna@Admin123

4. **If it doesn't work:**
```bash
# Verify admin user
cd backend
node verifyAtlasAdmin.js

# Check server logs for errors
# Press Ctrl+C to stop server, then restart
npm start
```

---

## 🔍 Debug Mode:

If you need to debug, check these files:

1. **Server logs:** Terminal where `npm start` is running
2. **Browser console:** F12 → Console tab
3. **Network requests:** F12 → Network tab
4. **Backend route:** `/backend/routes/admin.js` - login logic
5. **Frontend auth:** `/frontend/js/admin/auth.js` - login handler
6. **Config:** `/frontend/js/config.js` - API URL

---

## 💡 Tips:

1. **Keep server running:** Don't close the terminal where `npm start` is running
2. **Check MongoDB:** Verify MongoDB Atlas is accessible
3. **Clear cache:** Always do hard refresh (Cmd+Shift+R) after code changes
4. **Check console:** Browser console shows helpful error messages
5. **Verify admin:** Run verifyAtlasAdmin.js to ensure admin user exists

---

## ✅ Expected Behavior:

After successful login:
1. Login form disappears
2. Admin dashboard appears
3. Shows "Welcome, Krishna Admin"
4. Menu items: Dashboard, Products, Orders, Categories, Reviews
5. No errors in browser console

---

**Server Status:** ✅ Running on http://localhost:3000  
**Admin Portal:** ✅ Open at http://localhost:3000/admin-portal-ke2025  
**Ready to login!** 🚀

**Try logging in now with the credentials above!**
