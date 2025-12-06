# 🌐 CORS Configuration Updated for Vercel Deployment

## ✅ Changes Made:

Updated `/backend/server.js` to allow cross-origin requests from your Vercel frontend deployment.

---

## 🔧 CORS Configuration:

### Allowed Origins:
```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',                              // Local development
    'https://krishna-enterprises-theta.vercel.app',       // Vercel deployment
    'https://krishna-enterprises-9oup.onrender.com'       // Render backend
  ],
  credentials: true  // Important: Allows cookies/sessions
}));
```

---

## 🍪 Session Cookie Configuration:

Updated session cookies to work with cross-origin requests:

```javascript
cookie: { 
  secure: process.env.NODE_ENV === 'production',          // HTTPS only in production
  httpOnly: true,                                          // Prevents XSS attacks
  maxAge: 24 * 60 * 60 * 1000,                           // 24 hours
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'  // Cross-origin support
}
```

**Key Changes:**
- `sameSite: 'none'` - Allows cookies to be sent cross-origin in production
- `secure: true` - Required when `sameSite: 'none'` (HTTPS only)

---

## 🚀 Deployment URLs:

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend (Vercel)** | https://krishna-enterprises-theta.vercel.app | User interface |
| **Backend (Render)** | https://krishna-enterprises-9oup.onrender.com | API server |
| **Database** | MongoDB Atlas | Data storage |
| **Local Development** | http://localhost:3000 | Testing |

---

## 📝 Environment Variables on Render:

Make sure these are set on your Render backend:

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://admin:22022@cluster0.pbqzoba.mongodb.net/krishna-enterprises?retryWrites=true&w=majority&appName=Cluster0
SESSION_SECRET=krishna-enterprises-secret-key-2025
PORT=3000
```

---

## 🧪 Testing Checklist:

### After Deploying to Render:

1. **Test CORS:**
   - ✅ Open https://krishna-enterprises-theta.vercel.app
   - ✅ Check browser console for CORS errors
   - ✅ Should see no "blocked by CORS policy" errors

2. **Test Authentication:**
   - ✅ User login from Vercel frontend
   - ✅ Admin login from Vercel frontend
   - ✅ Session persistence across page reloads

3. **Test API Calls:**
   - ✅ Products loading
   - ✅ Categories loading
   - ✅ Add to cart
   - ✅ Place order
   - ✅ Admin CRUD operations

4. **Test Session Cookies:**
   - Open DevTools → Application → Cookies
   - ✅ Verify `connect.sid` cookie is set
   - ✅ Check `SameSite=None` and `Secure=true`

---

## 🔐 Security Notes:

1. **HTTPS Required:** 
   - `sameSite: 'none'` requires HTTPS
   - Vercel and Render both provide HTTPS automatically

2. **Credentials:** 
   - All frontend fetch requests must include `credentials: 'include'`
   - Already configured in your frontend files

3. **CORS Origins:**
   - Only listed origins can access your API
   - Add new domains here if you deploy to additional platforms

---

## 🐛 Common Issues & Solutions:

### Issue 1: "Access-Control-Allow-Origin" Error
**Solution:** Domain not in CORS origin list. Add it to the array.

### Issue 2: Cookies Not Being Sent
**Solution:** 
- Check `credentials: 'include'` in fetch requests
- Verify `sameSite: 'none'` in session config
- Ensure using HTTPS in production

### Issue 3: Session Not Persisting
**Solution:**
- Check `NODE_ENV=production` is set on Render
- Verify session cookie settings
- Clear browser cookies and test again

---

## 🔄 Adding More Domains:

To allow additional domains in the future:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://krishna-enterprises-theta.vercel.app',
    'https://krishna-enterprises-9oup.onrender.com',
    'https://your-new-domain.com'  // Add here
  ],
  credentials: true
}));
```

---

## ✅ Summary:

**Frontend URLs that can access your API:**
- ✅ http://localhost:3000 (Development)
- ✅ https://krishna-enterprises-theta.vercel.app (Production)
- ✅ https://krishna-enterprises-9oup.onrender.com (Backend)

**Features Enabled:**
- ✅ Cross-origin requests
- ✅ Session cookies across domains
- ✅ Secure authentication
- ✅ HTTPS enforcement in production

---

**Date Updated:** December 6, 2025  
**Frontend:** Vercel (https://krishna-enterprises-theta.vercel.app)  
**Backend:** Render (https://krishna-enterprises-9oup.onrender.com)  
**Database:** MongoDB Atlas
