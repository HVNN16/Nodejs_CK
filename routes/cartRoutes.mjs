// import express from 'express';
// import Cart from '../models/cart.mjs'; 
// import Product from '../models/product.mjs'; 

// const router = express.Router();


// router.get('/cart', async (req, res) => {
//   try {
//     const userId = req.session.userId; 
//     const cart = await Cart.findOne({ userId }).populate('items.productId');

    
//     let subtotal = 0;
//     if (cart && cart.items) {
//       cart.items.forEach(item => {
//         subtotal += item.productId.price * item.quantity;
//       });
//     }

//     res.render('cart', { cart, subtotal: subtotal.toFixed(2) });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Lỗi khi tải giỏ hàng');
//   }
// });

// let cart = { items: [] };

// router.post('/add-to-cart', async (req, res) => {
//   try {
//     const { productId, quantity } = req.body;
//     if (!productId || !quantity) {
//       return res.status(400).json({ message: 'Missing productId or quantity' });
//     }

//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     let cart = await Cart.findOne();
//     if (!cart) {
//       cart = new Cart({
//         items: [{ productId: product._id, quantity }],
//       });
//       await cart.save();
//       return res.status(200).json({ message: 'Product added to cart successfully' });
//     } else {
//       const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
//       if (itemIndex >= 0) {
//         cart.items[itemIndex].quantity += quantity;
//       } else {
//         cart.items.push({ productId: product._id, quantity });
//       }
//       await cart.save();
//       return res.status(200).json({ message: 'Product added to cart successfully' });
//     }
//   } catch (error) {
//     console.error('Error adding product to cart:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// router.post('/remove-from-cart', async (req, res) => {
//   const { productId } = req.body; 

//   try {
//     const userId = req.session.userId; 

//     const cart = await Cart.findOneAndUpdate(
//       { userId },
//       { $pull: { items: { productId: productId } } }, 
//       { new: true } 
//     );

//     if (!cart) {
//       return res.status(404).send({ message: "Giỏ hàng không tồn tại." });
//     }

//     let subtotal = 0;
//     cart.items.forEach(item => {
//       subtotal += item.productId.price * item.quantity;
//     });

//     res.json({ message: 'Sản phẩm đã được xóa', subtotal: subtotal.toFixed(2) });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ message: 'Lỗi khi xóa sản phẩm khỏi giỏ hàng.' });
//   }
// });

import express from 'express';
import Cart from '../models/cart.mjs';
import Product from '../models/product.mjs';

const router = express.Router();

// Hàm tạo baseUrl dựa trên môi trường
const getBaseUrl = (req) => {
  // Kiểm tra nếu đang chạy trên Render.com (dùng https)
  if (process.env.NODE_ENV === 'production') {
    return 'https://' + req.get('host');
  }
  // Nếu chạy trên localhost, dùng giao thức từ request
  return req.protocol + '://' + req.get('host');
};

// Lấy giỏ hàng (giao diện HTML)
router.get('/cart', async (req, res) => {
  try {
    const userId = req.session.userId || 'guest';
    console.log('UserId in /cart:', userId);

    const cart = await Cart.findOne({ userId }).populate('items.productId');
    console.log('Cart found in /cart:', cart);

    const baseUrl = getBaseUrl(req);
    let subtotal = 0;
    let cartItems = [];
    if (cart && cart.items) {
      cartItems = cart.items.map(item => {
        if (!item.productId) {
          console.warn('Product not found for item:', item);
          return null;
        }
        const itemTotal = item.productId.price * item.quantity;
        subtotal += itemTotal;
        return {
          productId: {
            _id: item.productId._id,
            name: item.productId.name,
            price: item.productId.price,
            image: item.productId.image.match(/^https?:\/\//) // Kiểm tra cả http và https
                ? item.productId.image
                : `${baseUrl}/images/${item.productId.image.split('/').pop()}`,
            category: item.productId.category || 'N/A',
          },
          quantity: item.quantity,
          total: itemTotal,
        };
      }).filter(item => item !== null);
    }

    res.render('cart', { cart: { items: cartItems }, subtotal: subtotal.toFixed(2) });
  } catch (error) {
    console.error('Error in /cart route:', error);
    res.status(500).send('Lỗi khi tải giỏ hàng');
  }
});

// Lấy giỏ hàng (JSON API)
router.get('/api/cart', async (req, res) => {
  try {
    const userId = req.session.userId || 'guest';
    console.log('Fetching cart for userId:', userId);

    const cart = await Cart.findOne({ userId }).populate('items.productId');
    console.log('Cart found in /api/cart:', cart);

    if (!cart) {
      return res.status(200).json({ items: [], subtotal: 0 });
    }

    const baseUrl = getBaseUrl(req);
    let subtotal = 0;
    const cartItems = cart.items.map(item => {
      if (!item.productId) {
        console.warn('Product not found for item:', item);
        return null;
      }
      const itemTotal = item.productId.price * item.quantity;
      subtotal += itemTotal;
      return {
        productId: item.productId._id,
        name: item.productId.name,
        price: item.productId.price,
        quantity: item.quantity,
        image: item.productId.image.match(/^https?:\/\//) // Kiểm tra cả http và https
            ? item.productId.image
            : `${baseUrl}/images/${item.productId.image.split('/').pop()}`,
        total: itemTotal,
      };
    }).filter(item => item !== null);

    res.status(200).json({
      items: cartItems,
      subtotal: subtotal.toFixed(2),
    });
  } catch (error) {
    console.error('Error in /api/cart route:', error);
    res.status(500).json({ message: 'Error loading cart', error: error.message });
  }
});

// Thêm vào giỏ hàng
router.post('/add-to-cart', async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.session.userId || 'guest';

    if (!productId || !quantity) {
      return res.status(400).json({ message: 'Missing productId or quantity' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ productId: product._id, quantity }],
      });
    } else {
      const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
      if (itemIndex >= 0) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId: product._id, quantity });
      }
    }
    await cart.save();
    res.status(200).json({ message: 'Product added to cart successfully' });
  } catch (error) {
    console.error('Error adding product to cart:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cập nhật số lượng
router.post('/update-quantity', async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.session.userId || 'guest';

    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({ message: 'Invalid productId or quantity' });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (itemIndex >= 0) {
      cart.items[itemIndex].quantity = quantity;
      await cart.save();

      const updatedCart = await Cart.findOne({ userId }).populate('items.productId');
      let subtotal = 0;
      const cartItems = updatedCart.items.map(item => {
        const itemTotal = item.productId.price * item.quantity;
        subtotal += itemTotal;
        return {
          productId: item.productId._id,
          name: item.productId.name,
          price: item.productId.price,
          quantity: item.quantity,
          total: itemTotal,
        };
      });

      res.status(200).json({
        message: 'Quantity updated successfully',
        items: cartItems,
        subtotal: subtotal.toFixed(2),
      });
    } else {
      res.status(404).json({ message: 'Product not in cart' });
    }
  } catch (error) {
    console.error('Error updating quantity:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Xóa khỏi giỏ hàng
router.post('/remove-from-cart', async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.session.userId || 'guest';

    const cart = await Cart.findOneAndUpdate(
      { userId },
      { $pull: { items: { productId } } },
      { new: true }
    ).populate('items.productId');

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const baseUrl = getBaseUrl(req);
    let subtotal = 0;
    const cartItems = cart.items.map(item => {
      const itemTotal = item.productId.price * item.quantity;
      subtotal += itemTotal;
      return {
        productId: item.productId._id,
        name: item.productId.name,
        price: item.productId.price,
        quantity: item.quantity,
        image: item.productId.image.match(/^https?:\/\//)
            ? item.productId.image
            : `${baseUrl}/images/${item.productId.image.split('/').pop()}`,
        total: itemTotal,
      };
    });

    res.status(200).json({
      message: 'Product removed from cart',
      items: cartItems,
      subtotal: subtotal.toFixed(2),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error removing product from cart' });
  }
});

export default router;
