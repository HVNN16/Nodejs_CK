import Cart from '../models/cart.mjs';
import Product from '../models/product.mjs';
import mongoose from 'mongoose';

class CartController {
  static async addToCart(req, res) {
    try {
      const userId = req.user?.id;
      const { productId, quantity } = req.body;
      console.log('Add to Cart:', { userId, productId, quantity });
  
      if (!productId || !quantity || quantity <= 0) {
        return res.status(400).json({ message: 'Product ID and valid quantity are required.' });
      }
  
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found.' });
      }
  
      // Cố gắng tăng quantity nếu sản phẩm đã tồn tại
      const cartUpdate = await Cart.findOneAndUpdate(
        { userId, 'items.productId': productId },
        { $inc: { 'items.$.quantity': parseInt(quantity) } },
        { new: true }
      );
  
      if (!cartUpdate) {
        // Nếu không tìm thấy mục nào, thêm mới
        await Cart.updateOne(
          { userId },
          {
            $push: { items: { productId: product._id, quantity: parseInt(quantity) } },
            $setOnInsert: { userId }
          },
          { upsert: true }
        );
      }
  
      const updatedCart = await Cart.findOne({ userId }).populate('items.productId');
      const cartItems = updatedCart.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        total: item.productId.price * item.quantity,
      }));
      const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  
      res.status(200).json({
        message: 'Product added to cart successfully.',
        cart: {
          items: cartItems,
          totalItems: totalItems,
        },
      });
    } catch (error) {
      console.error('Add to Cart error:', error);
      res.status(500).json({ message: 'Server error. Please try again.' });
    }
  }
  static async viewCart(req, res) {
    if (!req.user || !req.user.id) {
      return res.redirect('/login');
    }
  
    const userId = req.user.id;
  
    try {
      const cart = await Cart.findOne({ userId }).populate('items.productId');
      const cartData = cart ? {
        items: cart.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          total: item.productId.price * item.quantity,
        })),
        subtotal: cart.items.reduce((acc, item) => acc + item.productId.price * item.quantity, 0)
      } : { items: [], subtotal: 0 };
  
      res.render('cart', {
        cart: cartData,
        subtotal: cartData.subtotal,
        user: req.user
      });
    } catch (error) {
      console.error('Error viewing cart:', error);
      res.status(500).send('Lỗi khi tải giỏ hàng');
    }
  }
  static async removeFromCart(req, res) {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ message: 'productId is required' });
    }

    try {
      const cart = await Cart.findOneAndUpdate(
        { userId },
        { $pull: { items: { productId } } },
        { new: true }
      ).populate('items.productId');

      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }

      const cartItems = cart.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        total: item.productId.price * item.quantity,
      }));
      const subtotal = cartItems.reduce((acc, item) => acc + item.total, 0);

      res.status(200).json({
        message: 'Product removed from cart',
        items: cartItems,
        subtotal: subtotal.toFixed(2),
      });
    } catch (error) {
      console.error('Error removing product from cart:', error);
      res.status(500).json({ message: 'Error removing product from cart' });
    }
  }

  static async updateQuantity(req, res) {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { productId, quantity } = req.body;
    if (!productId || !quantity) {
      return res.status(400).json({ message: 'productId and quantity are required' });
    }

    try {
      const cart = await Cart.findOne({ userId });
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }

      const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
      if (itemIndex >= 0) {
        cart.items[itemIndex].quantity = parseInt(quantity);
        await cart.save();

        const updatedCart = await Cart.findOne({ userId }).populate('items.productId');
        const cartItems = updatedCart.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          total: item.productId.price * item.quantity,
        }));
        const subtotal = cartItems.reduce((acc, item) => acc + item.total, 0);

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
  }
}

export default CartController;