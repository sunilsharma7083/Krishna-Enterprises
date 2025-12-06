# Category Management - Testing Guide

## 🧪 Testing Steps:

### Step 1: Test Home Page Categories
1. Open: http://localhost:3000
2. Scroll down to "Product Categories" section
3. ✅ Should see 4 categories: Trophies, Awards, Medals, Crystal
4. ✅ Each category should have an icon, name, and description
5. ✅ Hover over categories to see animation effects

### Step 2: Test Admin Login
1. Open: http://localhost:3000/admin-portal-ke2025
2. Login with:
   - Email: sales@krishnaenterprises.info
   - Password: Krishna@Admin123
3. ✅ Should successfully login and see dashboard

### Step 3: Test Categories Management
1. Click "Categories" in the left sidebar
2. ✅ Should see categories page with table
3. ✅ Table should show all 4 categories with:
   - Name (with icon)
   - Description
   - Display Order
   - Status (Active/Inactive)
   - Created Date
   - Actions (Edit/Delete buttons)

### Step 4: Test Add Category
1. Click "Add Category" button (top right)
2. Fill in the form:
   - Name: "Custom Plaques"
   - Description: "Personalized custom plaques"
   - Icon: "fa-certificate"
   - Display Order: 5
   - Active: ✓ (checked)
3. Click "Save Category"
4. ✅ Should see success message
5. ✅ New category should appear in table

### Step 5: Test Edit Category
1. Click "Edit" button on any category
2. Change the description
3. Click "Save Category"
4. ✅ Should see success message
5. ✅ Changes should be reflected in table

### Step 6: Test Delete Category
1. Click "Delete" button on the category you just created
2. Confirm deletion
3. ✅ Should see success message
4. ✅ Category should be removed from table

### Step 7: Test Category Status
1. Edit a category
2. Uncheck "Active"
3. Save
4. ✅ Should see "Inactive" status in table
5. Go to home page (http://localhost:3000)
6. ✅ Inactive category should NOT appear on home page
7. Go back to admin and make it active again

## 🐛 Common Issues & Solutions:

### Issue: "Access denied" error in Categories page
**Solution**: Make sure you're logged in as admin. Logout and login again.

### Issue: Categories not loading in admin
**Solution**: 
1. Check browser console (F12) for errors
2. Verify you're logged in as admin
3. Try refreshing the page

### Issue: Categories not showing on home page
**Solution**: 
1. Make sure categories are marked as "Active"
2. Check display order (lower numbers appear first)
3. Clear browser cache and refresh

### Issue: Changes not saving
**Solution**:
1. Check browser console for errors
2. Verify all required fields are filled
3. Make sure category name is unique

## 🔍 API Endpoints for Testing:

### Public Endpoint (active categories only):
```bash
curl http://localhost:3000/api/categories
```

### Admin Endpoint (all categories):
```bash
# Note: Requires authentication cookie
curl http://localhost:3000/api/categories/all -H "Cookie: connect.sid=YOUR_SESSION_ID"
```

## ✅ Expected Results:

- Home page shows 4 category cards
- Admin portal shows all categories in table
- Add/Edit/Delete operations work smoothly
- Success/Error messages appear correctly
- Active/Inactive status controls visibility on home page

## 📞 Contact Information Displayed:

- Phone: +91 9782070381, +91 7014881124
- Email: sales@krishnaenterprises.info
- Admin: sales@krishnaenterprises.info

---

**Server**: http://localhost:3000
**Admin Portal**: http://localhost:3000/admin-portal-ke2025
**Admin Credentials**: sales@krishnaenterprises.info / Krishna@Admin123

Happy Testing! 🎉
