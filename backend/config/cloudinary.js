// Cloudinary Configuration
// This will automatically upload admin's file uploads to Cloudinary cloud storage

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary with your credentials from .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'krishna-enterprises/products', // Folder in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [
      { width: 1000, height: 1000, crop: 'limit' }, // Max dimensions
      { quality: 'auto' }, // Auto quality optimization
      { fetch_format: 'auto' } // Auto format selection
    ]
  }
});

// Create multer upload instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Function to delete image from Cloudinary
const deleteImage = async (imageUrl) => {
  try {
    // Extract public_id from Cloudinary URL
    const urlParts = imageUrl.split('/');
    const filename = urlParts[urlParts.length - 1];
    const publicId = `krishna-enterprises/products/${filename.split('.')[0]}`;
    
    await cloudinary.uploader.destroy(publicId);
    console.log('✅ Deleted image from Cloudinary:', publicId);
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
  }
};

module.exports = {
  upload,
  deleteImage,
  cloudinary
};
