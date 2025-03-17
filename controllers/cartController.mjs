import Cart from '../models/cart.mjs';
import Product from '../models/product.mjs';

class CartController {
  static async addToCart(req, res) {
    const userId = req.session.user._id;
    const { productId, quantity } = req.body;

    try {
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
          cart.items[itemIndex].quantity += parseInt(quantity);
        } else {
          cart.items.push({ productId: product._id, quantity });
        }
      }
      await cart.save();

      // Lấy thông tin giỏ hàng sau khi cập nhật để trả về
      const updatedCart = await Cart.findOne({ userId }).populate('items.productId');
      const cartItems = updatedCart.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        total: item.productId.price * item.quantity,
      }));
      const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

      // Trả về response JSON thay vì redirect
      res.status(200).json({
        message: 'Product added to cart successfully',
        cart: {
          items: cartItems,
          totalItems: totalItems
        }
      });
    } catch (error) {
      console.error('Error adding product to cart:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  static async viewCart(req, res) {
    const userId = req.session.user._id;

    try {
      const cart = await Cart.findOne({ userId }).populate('items.productId');
      if (!cart) {
        return res.render('cart', { cart: { items: [] }, subtotal: 0 });
      }

      const cartItems = cart.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        total: item.productId.price * item.quantity,
      }));
      const subtotal = cartItems.reduce((acc, item) => acc + item.total, 0);
      res.render('cart', { cart: { items: cartItems }, subtotal });
    } catch (error) {
      console.error('Error viewing cart:', error);
      res.status(500).send('Lỗi khi tải giỏ hàng');
    }
  }

  static async removeFromCart(req, res) {
    const userId = req.session.user._id;
    const { productId } = req.body;

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
    const userId = req.session.user._id;
    const { productId, quantity } = req.body;

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