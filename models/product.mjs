import mongoose from 'mongoose';

// Định nghĩa schema cho Product
const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number, default: null },
  image: { type: String, required: true, trim: true },
  sale: { type: Boolean, default: false },
  newArrival: { type: Boolean, default: false },
  bestSeller: { type: Boolean, default: false },
  description: { type: String, default: '' },
  content: { type: String, default: '' },
});

// Định nghĩa và xuất model trực tiếp từ mongoose
export default mongoose.model('Product', productSchema);
