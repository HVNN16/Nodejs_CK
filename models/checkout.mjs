import mongoose from 'mongoose';
import dbConnection from '../config/connectDB.mjs';

const checkoutSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
    },
  ],
  totalPrice: { type: Number, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
  statusHistory: [
    {
      status: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  shippingInfo: {
    firstname: String,
    lastname: String,
    phone: String,
    email: String,
    streetaddress: String,
    apartment: String,
    towncity: String,
    country: String,
  },
  paymentMethod: String,
});

export default dbConnection.model('Checkout', checkoutSchema);