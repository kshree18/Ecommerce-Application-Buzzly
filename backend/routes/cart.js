import express from 'express';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get user's cart
router.get('/', protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    res.status(200).json({
      status: 'success',
      data: {
        cart: cart
      }
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get cart'
    });
  }
});

// Add item to cart
router.post('/add', protect, async (req, res) => {
  try {
    const { productId, amount = 1 } = req.body;

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(item => 
      item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update existing item amount
      cart.items[existingItemIndex].amount += amount;
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        title: product.title,
        price: product.price,
        amount: amount,
        image: product.image
      });
    }

    await cart.save();
    await cart.populate('items.product');

    res.status(200).json({
      status: 'success',
      data: {
        cart: cart
      }
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to add item to cart'
    });
  }
});

// Update cart item amount
router.put('/update/:productId', protect, async (req, res) => {
  try {
    const { productId } = req.params;
    const { amount } = req.body;

    if (amount < 1) {
      return res.status(400).json({
        status: 'error',
        message: 'Amount must be at least 1'
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      return res.status(404).json({
        status: 'error',
        message: 'Cart not found'
      });
    }

    const itemIndex = cart.items.findIndex(item => 
      item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        status: 'error',
        message: 'Item not found in cart'
      });
    }

    cart.items[itemIndex].amount = amount;
    await cart.save();
    await cart.populate('items.product');

    res.status(200).json({
      status: 'success',
      data: {
        cart: cart
      }
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update cart'
    });
  }
});

// Remove item from cart
router.delete('/remove/:productId', protect, async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      return res.status(404).json({
        status: 'error',
        message: 'Cart not found'
      });
    }

    cart.items = cart.items.filter(item => 
      item.product.toString() !== productId
    );

    await cart.save();
    await cart.populate('items.product');

    res.status(200).json({
      status: 'success',
      data: {
        cart: cart
      }
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to remove item from cart'
    });
  }
});

// Clear cart
router.delete('/clear', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      return res.status(404).json({
        status: 'error',
        message: 'Cart not found'
      });
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({
      status: 'success',
      data: {
        cart: cart
      }
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to clear cart'
    });
  }
});

export default router; 