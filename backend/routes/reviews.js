const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// Middleware to check if user is admin
function isAdmin(req, res, next) {
  if (req.session && req.session.isAdmin) {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Access denied. Admin only.' });
  }
}

// @route   GET /api/reviews
// @desc    Get all approved reviews
// @access  Public
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find({ isApproved: true })
      .sort({ createdAt: -1 })
      .limit(20);
    
    res.json({ 
      success: true, 
      data: reviews 
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching reviews' 
    });
  }
});

// @route   GET /api/reviews/all
// @desc    Get all reviews (including pending) - Admin only
// @access  Private (Admin)
router.get('/all', isAdmin, async (req, res) => {
  try {
    const reviews = await Review.find()
      .sort({ createdAt: -1 });
    
    res.json({ 
      success: true, 
      data: reviews,
      count: reviews.length
    });
  } catch (error) {
    console.error('Get all reviews error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching reviews' 
    });
  }
});

// @route   POST /api/reviews
// @desc    Submit a new review
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, email, rating, message } = req.body;
    
    // Validation
    if (!name || !rating || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, rating, and message are required' 
      });
    }
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ 
        success: false, 
        message: 'Rating must be between 1 and 5' 
      });
    }
    
    if (message.length > 1000) {
      return res.status(400).json({ 
        success: false, 
        message: 'Review message is too long (max 1000 characters)' 
      });
    }
    
    // Create review
    const review = new Review({
      name,
      email: email || '',
      rating,
      message,
      isApproved: false // Requires admin approval
    });
    
    await review.save();
    
    res.status(201).json({ 
      success: true, 
      message: 'Review submitted successfully! It will be visible after approval.',
      data: review 
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error submitting review' 
    });
  }
});

// @route   PUT /api/reviews/:id/approve
// @desc    Approve a review - Admin only
// @access  Private (Admin)
router.put('/:id/approve', isAdmin, async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );
    
    if (!review) {
      return res.status(404).json({ 
        success: false, 
        message: 'Review not found' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Review approved successfully',
      data: review 
    });
  } catch (error) {
    console.error('Approve review error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error approving review' 
    });
  }
});

// @route   DELETE /api/reviews/:id
// @desc    Delete a review - Admin only
// @access  Private (Admin)
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    
    if (!review) {
      return res.status(404).json({ 
        success: false, 
        message: 'Review not found' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Review deleted successfully' 
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting review' 
    });
  }
});

module.exports = router;
