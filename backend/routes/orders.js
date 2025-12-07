const express = require('express');
const router = express.Router();
const { Parser } = require('json2csv');
const Order = require('../models/Order');

// @route   GET /api/orders
// @desc    Get all orders (Admin only)
// @access  Private
router.get('/', async (req, res) => {
  try {
    // Check admin authentication
    if (!req.session.isAdmin) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { status } = req.query;
    let query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('items.productId')
      .sort({ orderDate: -1 });

    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/orders/my-orders
// @desc    Get user's orders by email or phone
// @access  Public
router.get('/my-orders', async (req, res) => {
  try {
    const { email, phone } = req.query;

    if (!email && !phone) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide email or phone number' 
      });
    }

    let query = {};
    if (email && phone) {
      query = { $or: [{ email }, { phone }] };
    } else if (email) {
      query.email = email;
    } else {
      query.phone = phone;
    }

    const orders = await Order.find(query)
      .populate('items.productId')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: orders });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.productId');
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/orders
// @desc    Create new order
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { customerName, email, phone, address, city, state, pincode, message, items, totalAmount } = req.body;

    // Validate required fields
    if (!customerName || !phone || !address || !city || !state || !pincode || !items || items.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields' 
      });
    }

    const order = new Order({
      customerName,
      email: email || '',
      phone,
      address,
      city,
      state,
      pincode,
      message: message || '',
      items,
      totalAmount: parseFloat(totalAmount)
    });

    await order.save();
    
    // Populate product details
    await order.populate('items.productId');

    res.status(201).json({ 
      success: true, 
      data: order, 
      message: 'Order placed successfully' 
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status (Admin only)
// @access  Private
router.put('/:id/status', async (req, res) => {
  try {
    // Check admin authentication
    if (!req.session.isAdmin) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { status } = req.body;
    
    if (!['New', 'Processing', 'Delivered', 'Cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    res.json({ success: true, data: order, message: 'Order status updated successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/orders/:id
// @desc    Delete order (Admin only)
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    // Check admin authentication
    if (!req.session.isAdmin) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    await Order.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/orders/export/csv
// @desc    Export all orders to CSV (Admin only)
// @access  Private
router.get('/export/csv', async (req, res) => {
  try {
    // Check admin authentication
    if (!req.session.isAdmin) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const orders = await Order.find().sort({ orderDate: -1 });

    // Prepare data for CSV
    const csvData = orders.map(order => {
      const products = order.items.map(item => 
        `${item.title} (Qty: ${item.quantity}, Price: ₹${item.price})`
      ).join('; ');

      const fullAddress = `${order.address}, ${order.city}, ${order.state} - ${order.pincode}`;

      return {
        'Order ID': order.orderNumber,
        'Date': new Date(order.orderDate).toLocaleDateString('en-IN'),
        'Customer Name': order.customerName,
        'Email': order.email || 'N/A',
        'Phone': order.phone,
        'Full Address': fullAddress,
        'Products Ordered': products,
        'Total Amount': `₹${order.totalAmount}`,
        'Status': order.status,
        'Message': order.message || 'N/A'
      };
    });

    // Convert to CSV
    const parser = new Parser();
    const csv = parser.parse(csvData);

    // Set headers for file download
    const filename = `krishna-enterprises-orders-${new Date().toISOString().split('T')[0]}.csv`;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csv);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/orders/stats/dashboard
// @desc    Get dashboard statistics (Admin only)
// @access  Private
router.get('/stats/dashboard', async (req, res) => {
  try {
    // Check admin authentication
    if (!req.session.isAdmin) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const totalOrders = await Order.countDocuments();
    const newOrders = await Order.countDocuments({ status: 'New' });
    const processingOrders = await Order.countDocuments({ status: 'Processing' });
    const deliveredOrders = await Order.countDocuments({ status: 'Delivered' });
    
    // Calculate total revenue
    const revenueResult = await Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    res.json({
      success: true,
      data: {
        totalOrders,
        newOrders,
        processingOrders,
        deliveredOrders,
        totalRevenue
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
