# Debugging Guide for Categories Section

## 🐛 Debugging Steps:

### Step 1: Open Browser Console
1. Open the admin portal: http://localhost:3000/admin-portal-ke2025
2. Press F12 or Right-click → Inspect
3. Go to the "Console" tab

### Step 2: Login
- Email: sales@krishnaenterprises.info
- Password: Krishna@Admin123

### Step 3: Click Categories
Click on "Categories" in the left sidebar

### Step 4: Check Console Logs
You should see these logs in the console:
- "Fetching categories data..."
- "Response status: 200" (or 403 if not authenticated)
- "Categories result: {success: true, data: [...]}"
- "Categories loaded: 4"

### Common Issues:

#### If you see "403 Forbidden":
**Problem**: Not authenticated as admin
**Solution**: 
1. Logout from admin portal
2. Close the browser tab completely
3. Open a fresh tab: http://localhost:3000/admin-portal-ke2025
4. Login again with sales@krishnaenterprises.info / Krishna@Admin123

#### If you see "Categories table body not found!":
**Problem**: The HTML table element is missing
**Solution**: This means the dashboard.js didn't render the categories page properly

#### If you see network error:
**Problem**: Server not responding
**Solution**: Check if server is running on port 3000

### Step 5: Check Network Tab
1. Go to "Network" tab in browser devtools
2. Click on "Categories" in sidebar
3. Look for request to "/api/categories/all"
4. Check:
   - Status Code (should be 200, not 403)
   - Response (should show categories data)
   - Request Headers (should include Cookie with session)

### Manual Test:
If everything else fails, test the API directly in console:

```javascript
// Test 1: Check if you're authenticated
fetch('/api/admin/check-auth', {credentials: 'include'})
  .then(r => r.json())
  .then(d => console.log('Auth:', d));

// Test 2: Fetch categories
fetch('/api/categories/all', {credentials: 'include'})
  .then(r => r.json())
  .then(d => console.log('Categories:', d));
```

Paste these commands one by one in the browser console and check the output.

---

## ✅ Expected Output:

```
Fetching categories data...
Response status: 200
Categories result: {success: true, data: Array(4)}
Categories loaded: 4
```

Then you should see the categories table with 4 rows.

---

## 📞 Quick Fix Commands:

If server is having issues, restart it:
```bash
lsof -ti:3000 | xargs kill -9; cd /Users/sunilkumarsharma/Desktop/Krishana_Expresis && npm start
```

If MongoDB is having issues:
```bash
mongosh krishna-enterprises --eval "db.categories.countDocuments()"
```

Should show: 4 categories
