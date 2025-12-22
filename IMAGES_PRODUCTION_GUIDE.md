# Product Images Upload to Production

## Problem
Images stored locally in `backend/uploads/products/` don't get pushed to Git and won't work in production.

## Solution Options

### Option 1: Use Cloudinary (Recommended for Production)
1. Sign up for free Cloudinary account at: https://cloudinary.com/users/register/free
2. Get your credentials:
   - Cloud Name
   - API Key
   - API Secret
3. Update `.env` file with correct credentials
4. Run: `node upload-to-cloudinary.js`

### Option 2: Commit Images to Git (Quick Fix)
Images are now in `backend/uploads/products/`

**To make images work in production:**

```bash
# 1. Add the uploads folder to Git
git add backend/uploads/products/

# 2. Commit the images
git commit -m "Add product images"

# 3. Push to GitHub
git push origin main
```

**Update Render Environment:**
On Render.com dashboard, add this environment variable:
```
SERVE_STATIC_FILES=true
```

### Option 3: Use ImgBB (Free Alternative)
1. Sign up at: https://imgbb.com/
2. Get API key
3. I'll create an upload script for ImgBB

## Current Status
✅ 11 products added to database
✅ Images stored locally in `backend/uploads/products/`
❌ Images need to be uploaded to cloud or committed to Git

## Next Steps
Choose Option 2 (quickest) and run:
```bash
git add backend/uploads/products/
git commit -m "Add product images"
git push origin main
```

Then your images will work on the live website!
