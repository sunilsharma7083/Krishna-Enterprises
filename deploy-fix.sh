#!/bin/bash

# Quick Deploy Script - Fix Image Display Issue
# This script commits and pushes the image URL fix to GitHub
# Vercel will automatically detect and deploy the changes

echo "🚀 Deploying Image Fix to Vercel..."
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this from the project root."
    exit 1
fi

# Show what changed
echo "📝 Files changed:"
git status --short

echo ""
echo "📦 Adding all changes..."
git add .

echo ""
echo "💾 Committing changes..."
git commit -m "Fix: Image URLs now point to Render backend for proper display on Vercel

- Updated getImageUrl() in app.js to use hardcoded Render URL
- Updated getImageUrl() in products.js to use hardcoded Render URL  
- Updated getImageUrl() in admin/products-admin.js to use hardcoded Render URL
- Images now load correctly on Vercel deployment
- Fixes issue where images were returning 404 on production"

echo ""
echo "🚢 Pushing to GitHub..."
git push origin main

echo ""
echo "✅ Deployment initiated!"
echo ""
echo "📊 Next steps:"
echo "1. Vercel will automatically detect the push (takes 1-2 minutes)"
echo "2. Check deployment status: https://vercel.com/dashboard"
echo "3. Once deployed, clear browser cache and refresh"
echo "4. Test your site: https://krishna-enterprises-theta.vercel.app"
echo ""
echo "🎉 Images should now display correctly!"
