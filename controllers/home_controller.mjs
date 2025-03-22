import Cart from '../models/cart.mjs';
import User from '../models/user.mjs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

class HomeController {
  static index(req, res) {
    res.render('index', { title: 'Home Page', user: req.user });
  }

  static login(req, res) {
    res.render('login', { title: 'Login', error: null, user: req.user });
  }

  static signup(req, res) {
    res.render('signup', { title: 'Signup', error: null, user: req.user });
  }

  static async createSignup(req, res) {
    try {
      const { name, email, password, confirmpasword, age } = req.body;
      console.log('Received signup data (web):', { name, email, password, confirmpasword, age });

      if (!name || !email || !password || !confirmpasword) {
        return res.status(400).render('signup', { title: 'Signup', error: 'All fields are required.', user: null });
      }

      if (password !== confirmpasword) {
        return res.status(400).render('signup', { title: 'Signup', error: 'Passwords do not match.', user: null });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ name, email, password: hashedPassword, age });
      await user.save();

      res.redirect('/login');
    } catch (error) {
      console.error('Signup error (web):', error);
      res.status(500).render('signup', { title: 'Signup', error: 'Server error. Please try again.', user: null });
    }
  }

  static async createLogin(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.render('login', { title: 'Login', error: 'Invalid email or password.', user: null });
      }
  
      // Thêm id vào payload
      const payload = { id: user._id.toString(), name: user.name, email: user.email };
      const token = jwt.sign(payload, 'demoDA', { expiresIn: '1h' });
  
      res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });
      res.redirect('/');
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).render('login', { title: 'Login', error: 'Server error.', user: null });
    }
  }
  static async apiCreateSignup(req, res) {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ name, email, password: hashedPassword });
      await user.save();

      res.status(200).json({ message: 'Signup successful!' });
    } catch (error) {
      res.status(500).json({ message: 'Server error. Please try again.', error: error.message });
    }
  }

  static async apiCreateLogin(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }
  
      // Thêm id vào payload
      const payload = { id: user._id.toString(), name: user.name, email: user.email };
      const token = jwt.sign(payload, 'demoDA', { expiresIn: '1h' });
  
      res.status(200).json({
        message: 'Login successful.',
        accessToken: token,
        user: { id: user._id.toString(), name: user.name, email: user.email },
      });
    } catch (error) {
      console.error('Login error (API):', error);
      res.status(500).json({ message: 'Server error.' });
    }
  }


  static async getCart(req, res) {
    console.log('req.user in getCart:', req.user); // Debug
    const userId = req.user?.id;
    //console.log('User ID from token:', userId);
    try {
      const cart = await Cart.findOne({ userId: new mongoose.Types.ObjectId(userId) }).populate('items.productId');
      //console.log('Cart found:', cart);
      if (!cart) {
        //console.log('No cart found for user:', userId);
        return res.status(200).json({
          cart: { items: [], subtotal: 0 },
          subtotal: 0,
          user: req.user
        });
      }
      const cartData = {
        items: cart.items.map(item => {
          //console.log('Item:', item);
          return {
            productId: item.productId,
            quantity: item.quantity,
            total: item.productId.price * item.quantity,
          };
        }),
        subtotal: cart.items.reduce((acc, item) => acc + item.productId.price * item.quantity, 0)
      };
      res.status(200).json({
        cart: cartData,
        subtotal: cartData.subtotal,
        user: req.user
      });
    } catch (error) {
      //console.error('Error viewing cart:', error);
      res.status(500).json({ message: 'Error viewing cart', error: error.message });
    }
  }
  // static async apiAddToCart(req, res) {
  //   try {
  //     const userId = req.user?.id;
  //     const { productId, quantity } = req.body;
  //     console.log('Add to Cart:', { productId, quantity });

  //     if (!productId || !quantity || quantity <= 0) {
  //       return res.status(400).json({ message: 'Product ID and valid quantity are required.' });
  //     }

  //     const product = await Product.findById(productId);
  //     if (!product) {
  //       return res.status(404).json({ message: 'Product not found.' });
  //     }

  //     let cart = await Cart.findOne({ userId });
  //     if (!cart) {
  //       cart = new Cart({
  //         userId,
  //         items: [{ productId: product._id, quantity }],
  //       });
  //     } else {
  //       const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
  //       if (itemIndex >= 0) {
  //         cart.items[itemIndex].quantity += parseInt(quantity);
  //       } else {
  //         cart.items.push({ productId: product._id, quantity });
  //       }
  //     }
  //     await cart.save();

  //     const updatedCart = await Cart.findOne({ userId }).populate('items.productId');
  //     const cartItems = updatedCart.items.map(item => ({
  //       productId: item.productId,
  //       quantity: item.quantity,
  //       total: item.productId.price * item.quantity,
  //     }));
  //     const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  //     res.status(200).json({
  //       message: 'Product added to cart successfully.',
  //       cart: {
  //         items: cartItems,
  //         totalItems: totalItems,
  //       },
  //     });
  //   } catch (error) {
  //     console.error('Add to Cart error:', error);
  //     res.status(500).json({ message: 'Server error. Please try again.' });
  //   }
  // }

  // static async updateQuantity(req, res) {
  //   try {
  //     const userId = req.user?.id;
  //     const { productId, quantity } = req.body;
  //     console.log('Update Quantity:', { productId, quantity });

  //     if (!productId || !quantity) {
  //       return res.status(400).json({ message: 'Product ID and quantity are required.' });
  //     }

  //     const cart = await Cart.findOne({ userId });
  //     if (!cart) {
  //       return res.status(404).json({ message: 'Cart not found.' });
  //     }

  //     const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
  //     if (itemIndex >= 0) {
  //       if (quantity <= 0) {
  //         cart.items.splice(itemIndex, 1);
  //       } else {
  //         cart.items[itemIndex].quantity = parseInt(quantity);
  //       }
  //       await cart.save();

  //       const updatedCart = await Cart.findOne({ userId }).populate('items.productId');
  //       const cartItems = updatedCart.items.map(item => ({
  //         productId: item.productId,
  //         quantity: item.quantity,
  //         total: item.productId.price * item.quantity,
  //       }));
  //       const subtotal = cartItems.reduce((acc, item) => acc + item.total, 0);

  //       res.status(200).json({
  //         message: 'Quantity updated successfully.',
  //         cart: { items: cartItems, subtotal },
  //       });
  //     } else {
  //       res.status(404).json({ message: 'Product not in cart.' });
  //     }
  //   } catch (error) {
  //     console.error('Update Quantity error:', error);
  //     res.status(500).json({ message: 'Server error. Please try again.' });
  //   }
  // }

  // static async removeFromCart(req, res) {
  //   try {
  //     const userId = req.user?.id;
  //     const { productId } = req.body;
  //     console.log('Remove from Cart:', { productId });

  //     if (!productId) {
  //       return res.status(400).json({ message: 'Product ID is required.' });
  //     }

  //     const cart = await Cart.findOneAndUpdate(
  //       { userId },
  //       { $pull: { items: { productId } } },
  //       { new: true }
  //     ).populate('items.productId');

  //     if (!cart) {
  //       return res.status(404).json({ message: 'Cart not found.' });
  //     }

  //     const cartItems = cart.items.map(item => ({
  //       productId: item.productId,
  //       quantity: item.quantity,
  //       total: item.productId.price * item.quantity,
  //     }));
  //     const subtotal = cartItems.reduce((acc, item) => acc + item.total, 0);

  //     res.status(200).json({
  //       message: 'Product removed from cart successfully.',
  //       cart: { items: cartItems, subtotal },
  //     });
  //   } catch (error) {
  //     console.error('Remove from Cart error:', error);
  //     res.status(500).json({ message: 'Server error. Please try again.' });
  //   }
  // }
}

export default HomeController;