const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @route   POST /api/admin/login
// @desc    Admin login (email-based)
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide email and password' 
      });
    }

    // Find admin user
    const admin = await User.findOne({ email: email.toLowerCase(), role: 'admin' });

    if (!admin) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials or unauthorized access' 
      });
    }

    // Check password
    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Set session
    req.session.isAdmin = true;
    req.session.userId = admin._id;
    req.session.email = admin.email;
    req.session.name = admin.name;

    res.json({ 
      success: true, 
      message: 'Login successful',
      data: { 
        name: admin.name,
        email: admin.email 
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/admin/logout
// @desc    Admin logout
// @access  Private
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Logout failed' });
    }
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

// @route   GET /api/admin/check-auth
// @desc    Check if admin is authenticated
// @access  Private
router.get('/check-auth', (req, res) => {
  if (req.session.isAdmin) {
    res.json({ 
      success: true, 
      isAuthenticated: true,
      name: req.session.name,
      email: req.session.email
    });
  } else {
    res.json({ success: false, isAuthenticated: false });
  }
});

module.exports = router;
