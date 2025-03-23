import mongoose from 'mongoose';
import dbConnection from '../config/connectDB.mjs';

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true, min: 1, default: 1 },
    },
  ],
});

export default dbConnection.model('Cart', cartSchema);