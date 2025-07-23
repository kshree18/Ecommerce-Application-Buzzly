import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: [1, 'Amount must be at least 1']
  },
  image: {
    type: String,
    required: true
  }
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  total: {
    type: Number,
    default: 0
  },
  itemAmount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Calculate totals before saving
cartSchema.pre('save', function(next) {
  if (this.isModified('items')) {
    this.itemAmount = this.items.reduce((sum, item) => sum + item.amount, 0);
    this.total = this.items.reduce((sum, item) => sum + (item.price * item.amount), 0);
  }
  next();
});

// Ensure virtual fields are serialized
cartSchema.set('toJSON', {
  virtuals: true
});

export default mongoose.model('Cart', cartSchema); 