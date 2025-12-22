#!/bin/bash

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║     🚀 ADDING PRODUCTS WITH IMAGE URLS                      ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

API_BASE="http://localhost:3000/api"
COOKIE_FILE="/tmp/admin_cookie.txt"

# Step 1: Login as admin
echo "🔐 Logging in as admin..."
curl -s -c $COOKIE_FILE -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"sales@krishnaenterprises.info","password":"Krishna@Admin123"}' \
  "$API_BASE/auth/login" > /dev/null

if [ $? -eq 0 ]; then
  echo "✅ Admin login successful!"
else
  echo "❌ Login failed"
  exit 1
fi

echo ""
echo "🗑️  Deleting old products..."

# Get all products and delete them
PRODUCT_IDS=$(curl -s "$API_BASE/products" | grep -o '"_id":"[^"]*"' | cut -d'"' -f4)

for id in $PRODUCT_IDS; do
  curl -s -b $COOKIE_FILE -X DELETE "$API_BASE/products/$id" > /dev/null
  echo "✓ Deleted product: $id"
done

echo ""
echo "📦 Adding new products with image URLs..."
echo ""

# Product 1
curl -s -b $COOKIE_FILE -X POST "$API_BASE/products" \
  -F "title=Golden Champion Trophy" \
  -F "category=Sports Trophies" \
  -F "price=2500" \
  -F "description=Premium golden trophy perfect for sporting events and competitions" \
  -F "imageUrls=https://images.unsplash.com/photo-1614292253918-c5c8d5ba1f1c?w=800" \
  -F "featured=true" \
  -F "inStock=true" > /dev/null
echo "✅ Added: Golden Champion Trophy - ₹2,500"

# Product 2
curl -s -b $COOKIE_FILE -X POST "$API_BASE/products" \
  -F "title=Silver Excellence Award" \
  -F "category=Corporate Awards" \
  -F "price=3500" \
  -F "description=Sophisticated silver trophy ideal for corporate excellence awards" \
  -F "imageUrls=https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800" \
  -F "featured=true" \
  -F "inStock=true" > /dev/null
echo "✅ Added: Silver Excellence Award - ₹3,500"

# Product 3
curl -s -b $COOKIE_FILE -X POST "$API_BASE/products" \
  -F "title=Victory Cup Trophy" \
  -F "category=Sports Trophies" \
  -F "price=4500" \
  -F "description=Classic cup-style trophy for tournament winners" \
  -F "imageUrls=https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?w=800" \
  -F "featured=true" \
  -F "inStock=true" > /dev/null
echo "✅ Added: Victory Cup Trophy - ₹4,500"

# Product 4
curl -s -b $COOKIE_FILE -X POST "$API_BASE/products" \
  -F "title=Premium Crystal Award" \
  -F "category=Crystal Awards" \
  -F "price=5500" \
  -F "description=Stunning crystal award for corporate recognition" \
  -F "imageUrls=https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800" \
  -F "featured=true" \
  -F "inStock=true" > /dev/null
echo "✅ Added: Premium Crystal Award - ₹5,500"

# Product 5
curl -s -b $COOKIE_FILE -X POST "$API_BASE/products" \
  -F "title=Gold Star Trophy" \
  -F "category=Sports Trophies" \
  -F "price=3000" \
  -F "description=Beautiful gold star trophy for outstanding performance" \
  -F "imageUrls=https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=800" \
  -F "featured=true" \
  -F "inStock=true" > /dev/null
echo "✅ Added: Gold Star Trophy - ₹3,000"

# Product 6
curl -s -b $COOKIE_FILE -X POST "$API_BASE/products" \
  -F "title=Bronze Achievement Medal" \
  -F "category=Medals" \
  -F "price=800" \
  -F "description=High-quality bronze medal for third place winners" \
  -F "imageUrls=https://images.unsplash.com/photo-1513594688431-155b2e8b8d85?w=800" \
  -F "featured=true" \
  -F "inStock=true" > /dev/null
echo "✅ Added: Bronze Achievement Medal - ₹800"

# Product 7
curl -s -b $COOKIE_FILE -X POST "$API_BASE/products" \
  -F "title=Executive Achievement Plaque" \
  -F "category=Plaques" \
  -F "price=2000" \
  -F "description=Professional wooden plaque with metal plate" \
  -F "imageUrls=https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=800" \
  -F "featured=false" \
  -F "inStock=true" > /dev/null
echo "✅ Added: Executive Achievement Plaque - ₹2,000"

# Product 8
curl -s -b $COOKIE_FILE -X POST "$API_BASE/products" \
  -F "title=Team Championship Trophy" \
  -F "category=Sports Trophies" \
  -F "price=6000" \
  -F "description=Large championship trophy for team events" \
  -F "imageUrls=https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=800" \
  -F "featured=true" \
  -F "inStock=true" > /dev/null
echo "✅ Added: Team Championship Trophy - ₹6,000"

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║     ✅ DONE! 8 PRODUCTS ADDED WITH IMAGE URLS               ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo "🌐 Visit: http://localhost:5500"
echo "🔐 Admin: http://localhost:5500/admin"
echo ""

# Cleanup
rm -f $COOKIE_FILE
