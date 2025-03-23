import mongoose from 'mongoose';

// Định nghĩa schema cho Cart
const cartSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    unique: true 
  },
  items: [
    {
      productId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', 
        required: true 
      },
      quantity: { 
        type: Number, 
        required: true, 
        min: 1, 
        default: 1 
      },
    },
  ],
});

// Xuất model trực tiếp từ mongoose
export default mongoose.model('Cart', cartSchema);
