const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Product = require('../models/Product');

// Try to use Cloudinary if configured, otherwise use local storage
let upload;
let useCloudinary = false;

try {
  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
    const cloudinary = require('cloudinary').v2;
    const { CloudinaryStorage } = require('multer-storage-cloudinary');
    
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });
    
    // Configure Cloudinary storage
    const storage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: 'krishna-enterprises/products',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'],
        transformation: [
          { width: 1200, height: 1200, crop: 'limit' },
          { quality: 'auto' },
          { fetch_format: 'auto' }
        ]
      }
    });
    
    upload = multer({
      storage: storage,
      limits: { 
        fileSize: 10 * 1024 * 1024,
        files: 5
      }
    });
    
    useCloudinary = true;
    console.log('✅ Cloudinary configured - Images will auto-upload to cloud storage!');
  } else {
    throw new Error('Cloudinary not configured');
  }
} catch (error) {
  console.log('⚠️  Cloudinary not available, using local storage');
  
  // Fallback to local storage
  const uploadDir = path.join(__dirname, '../uploads/products');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
    }
  });

  upload = multer({
    storage: storage,
    limits: { 
      fileSize: 10 * 1024 * 1024,
      files: 5
    },
    fileFilter: (req, file, cb) => {
      console.log('📸 File upload attempt:', {
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Unknown'
      });
      
      const allowedTypes = /jpeg|jpg|png|gif|webp|bmp/;
      const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedTypes.test(file.mimetype);
      
      console.log('🔍 Validation:', { 
        extname, 
        mimetype,
        extension: path.extname(file.originalname).toLowerCase(),
        mimeType: file.mimetype
      });
      
      if (mimetype && extname) {
        console.log('✅ File accepted:', file.originalname);
        return cb(null, true);
      } else {
        console.log('❌ File rejected - Only image files allowed');
        console.log('   Allowed formats: JPEG, JPG, PNG, GIF, WEBP, BMP');
        cb(new Error('Only image files (JPEG, JPG, PNG, GIF, WEBP, BMP) are allowed!'));
      }
    }
  });
}

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
router.post('/', (req, res, next) => {
  upload.array('images', 5)(req, res, (err) => {
    if (err) {
      console.error('❌ Upload error:', err.message);
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ 
          success: false, 
          message: 'File size too large! Maximum size is 10MB per image.' 
        });
      }
      if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({ 
          success: false, 
          message: 'Too many files! Maximum 5 images allowed.' 
        });
      }
      return res.status(400).json({ 
        success: false, 
        message: err.message || 'Error uploading images' 
      });
    }
    next();
  });
}, async (req, res) => {
  try {
    // Check admin authentication
    if (!req.session.isAdmin) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { title, category, price, description, featured, inStock } = req.body;
    
    console.log('📦 Request body:', { title, category, price, description });
    console.log('📁 Files received:', req.files?.length || 0);
    
    // Validation
    if (!title || !category) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title and category are required' 
      });
    }
    
    // Get uploaded image paths or URLs
    const images = req.files ? req.files.map(file => {
      if (useCloudinary) {
        // Cloudinary returns the full URL in file.path
        console.log('☁️  Cloudinary upload:', file.path);
        return file.path;
      } else {
        // Local storage - return relative path
        console.log('📸 Local upload:', file.filename, `(${(file.size / 1024).toFixed(2)} KB)`);
        return `/uploads/products/${file.filename}`;
      }
    }) : [];
    
    // Add image URLs if provided (NEW FEATURE)
    if (req.body.imageUrls) {
      const imageUrls = Array.isArray(req.body.imageUrls) ? req.body.imageUrls : [req.body.imageUrls];
      imageUrls.forEach(url => {
        if (url && url.trim()) {
          console.log('🔗 Adding image URL:', url);
          images.push(url.trim());
        }
      });
    }
    
    console.log('📸 Total images to save:', images.length);
    console.log('🖼️  Image paths:', images);

    const product = new Product({
      title,
      category,
      price: price ? parseFloat(price) : 0,
      description: description || '',
      images,
      featured: featured === 'true' || featured === true,
      inStock: inStock !== 'false' && inStock !== false
    });

    await product.save();
    console.log('✅ Product saved successfully with ID:', product._id);
    console.log('✅ Images saved:', product.images);
    
    res.status(201).json({ 
      success: true, 
      data: product, 
      message: `Product created successfully with ${images.length} image(s)!` 
    });
  } catch (error) {
    console.error('❌ Error creating product:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/products/:id
// @desc    Update product (Admin only)
// @access  Private
router.put('/:id', (req, res, next) => {
  upload.array('images', 5)(req, res, (err) => {
    if (err) {
      console.error('❌ Upload error:', err.message);
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ 
          success: false, 
          message: 'File size too large! Maximum size is 10MB per image.' 
        });
      }
      if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({ 
          success: false, 
          message: 'Too many files! Maximum 5 images allowed.' 
        });
      }
      return res.status(400).json({ 
        success: false, 
        message: err.message || 'Error uploading images' 
      });
    }
    next();
  });
}, async (req, res) => {
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
    console.log('📁 New files received:', req.files?.length || 0);
    console.log('🖼️  Existing images to keep:', existingImages);
    
    // Handle existing images
    let images = [];
    if (existingImages) {
      images = Array.isArray(existingImages) ? existingImages : [existingImages];
      console.log('✅ Keeping', images.length, 'existing images');
    }

    // Add new uploaded images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => {
        if (useCloudinary) {
          console.log('☁️  Cloudinary upload:', file.path);
          return file.path;
        } else {
          console.log('📸 New file uploaded:', file.filename, `(${(file.size / 1024).toFixed(2)} KB)`);
          return `/uploads/products/${file.filename}`;
        }
      });
      images = [...images, ...newImages];
      console.log('✅ Added', newImages.length, 'new images');
    }
    
    // Add image URLs if provided (NEW FEATURE)
    if (req.body.imageUrls) {
      const imageUrls = Array.isArray(req.body.imageUrls) ? req.body.imageUrls : [req.body.imageUrls];
      imageUrls.forEach(url => {
        if (url && url.trim()) {
          console.log('🔗 Adding image URL:', url);
          images.push(url.trim());
        }
      });
    }
    
    console.log('🎯 Final images count:', images.length);
    console.log('🖼️  Final image paths:', images);

    // Update product fields
    product.title = title || product.title;
    product.category = category || product.category;
    product.price = price ? parseFloat(price) : product.price;
    product.description = description || product.description;
    product.images = images.length > 0 ? images : product.images;
    product.featured = featured === 'true' || featured === true;
    product.inStock = inStock !== 'false' && inStock !== false;

    await product.save();
    console.log('✅ Product updated successfully with ID:', product._id);
    console.log('✅ Images saved:', product.images);
    
    res.json({ 
      success: true, 
      data: product, 
      message: `Product updated successfully with ${images.length} image(s)!` 
    });
  } catch (error) {
    console.error('❌ Error updating product:', error);
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

    // Delete associated image files (only for local storage)
    if (!useCloudinary && product.images && product.images.length > 0) {
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
