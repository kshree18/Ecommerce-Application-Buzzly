import express from 'express';
import { body, validationResult } from 'express-validator';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @desc    Create new order (Checkout)
// @route   POST /api/orders
// @access  Private
router.post('/', protect, [
  body('orderItems')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one item'),
  body('orderItems.*.product')
    .isMongoId()
    .withMessage('Invalid product ID'),
  body('orderItems.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  body('shippingAddress')
    .isObject()
    .withMessage('Shipping address is required'),
  body('shippingAddress.firstName')
    .trim()
    .isLength({ min: 1 })
    .withMessage('First name is required'),
  body('shippingAddress.lastName')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Last name is required'),
  body('shippingAddress.street')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Street address is required'),
  body('shippingAddress.city')
    .trim()
    .isLength({ min: 1 })
    .withMessage('City is required'),
  body('shippingAddress.state')
    .trim()
    .isLength({ min: 1 })
    .withMessage('State is required'),
  body('shippingAddress.zipCode')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Zip code is required'),
  body('shippingAddress.country')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Country is required'),
  body('shippingAddress.phone')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Phone number is required'),
  body('paymentMethod')
    .isIn(['credit_card', 'paypal', 'stripe', 'cash_on_delivery'])
    .withMessage('Invalid payment method')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { orderItems, shippingAddress, paymentMethod, notes } = req.body;

    // Validate and get product details
    const validatedOrderItems = [];
    let itemsPrice = 0;

    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      
      if (!product || !product.isActive) {
        return res.status(400).json({
          status: 'error',
          message: `Product ${item.product} not found or unavailable`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          status: 'error',
          message: `Insufficient stock for ${product.title}. Available: ${product.stock}`
        });
      }

      // Calculate price (considering discounts)
      const finalPrice = product.discount > 0 
        ? product.price - (product.price * product.discount / 100)
        : product.price;

      validatedOrderItems.push({
        product: product._id,
        title: product.title,
        price: finalPrice,
        quantity: item.quantity,
        image: product.image
      });

      itemsPrice += finalPrice * item.quantity;

      // Update stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Calculate shipping and tax
    const shippingPrice = itemsPrice > 100 ? 0 : 10; // Free shipping over $100
    const taxPrice = itemsPrice * 0.1; // 10% tax

    const order = await Order.create({
      user: req.user.id,
      orderItems: validatedOrderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice: itemsPrice + taxPrice + shippingPrice,
      notes
    });

    res.status(201).json({
      status: 'success',
      message: 'Order created successfully',
      data: {
        order
      }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Get user orders
// @route   GET /api/orders/myorders
// @access  Private
router.get('/myorders', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Order.countDocuments({ user: req.user.id });

    const orders = await Order.find({ user: req.user.id })
      .populate('orderItems.product', 'title image')
      .limit(limit)
      .skip(startIndex)
      .sort({ createdAt: -1 });

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      status: 'success',
      count: orders.length,
      pagination,
      data: {
        orders
      }
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'firstName lastName email')
      .populate('orderItems.product', 'title image');

    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found'
      });
    }

    // Make sure user owns the order or is admin
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        status: 'error',
        message: 'Not authorized to access this order'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        order
      }
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
router.put('/:id/pay', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found'
      });
    }

    // Make sure user owns the order or is admin
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        status: 'error',
        message: 'Not authorized to update this order'
      });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id || 'manual',
      status: req.body.status || 'completed',
      update_time: new Date().toISOString(),
      email_address: req.body.email_address || req.user.email
    };

    await order.save();

    res.status(200).json({
      status: 'success',
      message: 'Order marked as paid',
      data: {
        order
      }
    });
  } catch (error) {
    console.error('Update order to paid error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Order.countDocuments();

    const orders = await Order.find()
      .populate('user', 'firstName lastName email')
      .limit(limit)
      .skip(startIndex)
      .sort({ createdAt: -1 });

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      status: 'success',
      count: orders.length,
      pagination,
      data: {
        orders
      }
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
router.put('/:id/status', protect, authorize('admin'), [
  body('status')
    .isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid order status'),
  body('trackingNumber')
    .optional()
    .isString()
    .withMessage('Tracking number must be a string')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { status, trackingNumber } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found'
      });
    }

    order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;

    // Set delivered date if status is delivered
    if (status === 'delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    await order.save();

    res.status(200).json({
      status: 'success',
      message: 'Order status updated successfully',
      data: {
        order
      }
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

export default router; 