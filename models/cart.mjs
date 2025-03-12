// import mongoose from 'mongoose';
// import { productDBConnection } from '../config/connectDB.mjs';
// import Product from '../models/product.mjs';

// const cartSchema = new mongoose.Schema({
//   items: [
//     {
//       productId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Product',
//         required: true,
//       },
//       quantity: {
//         type: Number,
//         required: true,
//         min: 1,
//         default: 1,
//       },
//     },
//   ],
// });

// const Cart = productDBConnection.model('Cart', cartSchema);

// export default Cart;
import mongoose from 'mongoose';
import { productDBConnection } from '../config/connectDB.mjs';

const cartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1,
      },
    },
  ],
});

const Cart = productDBConnection.model('Cart', cartSchema);

export default Cart;
