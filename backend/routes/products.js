const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Product = require('../models/Product');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../uploads/products');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// @route   GET /api/products
// @desc    Get all products (with optional filters)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, featured, search } = req.query;
    let query = {};

    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (featured === 'true') {
      query.featured = true;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/products
// @desc    Create new product (Admin only)
// @access  Private
router.post('/', upload.array('images', 5), async (req, res) => {
  try {
    // Check admin authentication
    if (!req.session.isAdmin) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { title, category, price, description, featured, inStock } = req.body;
    
    // Get uploaded image paths
    const images = req.files ? req.files.map(file => `/uploads/products/${file.filename}`) : [];
    
    console.log('📸 Creating product with images:', images);
    console.log('📁 Files received:', req.files?.length || 0);

    const product = new Product({
      title,
      category,
      price: parseFloat(price),
      description,
      images,
      featured: featured === 'true' || featured === true,
      inStock: inStock !== 'false' && inStock !== false
    });

    await product.save();
    console.log('✅ Product saved with images:', product.images);
    res.status(201).json({ success: true, data: product, message: 'Product created successfully' });
  } catch (error) {
    console.error('❌ Error creating product:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/products/:id
// @desc    Update product (Admin only)
// @access  Private
router.put('/:id', upload.array('images', 5), async (req, res) => {
  try {
    // Check admin authentication
    if (!req.session.isAdmin) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const { title, category, price, description, featured, inStock, existingImages } = req.body;
    
    console.log('📝 Updating product:', product.title);
    console.log('📁 Files received:', req.files?.length || 0);
    console.log('🖼️ Existing images:', existingImages);
    
    // Handle existing images
    let images = [];
    if (existingImages) {
      images = Array.isArray(existingImages) ? existingImages : [existingImages];
    }

    // Add new uploaded images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/products/${file.filename}`);
      images = [...images, ...newImages];
      console.log('📸 New images added:', newImages);
    }
    
    console.log('🎯 Final images array:', images);

    // Update product fields
    product.title = title || product.title;
    product.category = category || product.category;
    product.price = price ? parseFloat(price) : product.price;
    product.description = description || product.description;
    product.images = images.length > 0 ? images : product.images;
    product.featured = featured === 'true' || featured === true;
    product.inStock = inStock !== 'false' && inStock !== false;

    await product.save();
    console.log('✅ Product updated with images:', product.images);
    res.json({ success: true, data: product, message: 'Product updated successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete product (Admin only)
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    // Check admin authentication
    if (!req.session.isAdmin) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Delete associated image files
    if (product.images && product.images.length > 0) {
      product.images.forEach(imagePath => {
        const fullPath = path.join(__dirname, '..', imagePath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/products/categories/list
// @desc    Get all categories
// @access  Public
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
