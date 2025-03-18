// import User from '../models/user.mjs';

// class HomeController {
//   static index(req, res) {
//     console.log(req.query);
//     res.render('index', { title: 'Home Page', user: req.session.user });
//   }

//   static login(req, res) {
//     res.render('login', { title: 'Login', error: null });
//   }

//   static signup(req, res) {
//     res.render('signup', { title: 'Signup', error: null });
//   }

//   static async createSignup(req, res) {
//     try {
//       const { name, email, password, confirmpasword, age } = req.body;
//       console.log('Received signup data (web):', { name, email, password, confirmpasword, age });

//       if (!name || !email || !password || !confirmpasword) {
//         return res.render('signup', { title: 'Signup', error: 'All fields are required.' });
//       }

//       if (password !== confirmpasword) {
//         return res.render('signup', { title: 'Signup', error: 'Passwords do not match.' });
//       }

//       const existingUser = await User.findOne({ email });
//       if (existingUser) {
//         return res.render('signup', { title: 'Signup', error: 'Email already in use.' });
//       }

//       const newUser = new User({
//         name,
//         email,
//         password,
//         age: age || undefined,
//       });

//       await newUser.save();
//       res.redirect('/login');
//     } catch (error) {
//       console.error('Signup error (web):', error);
//       res.status(500).render('signup', { title: 'Signup', error: 'Server error. Please try again.' });
//     }
//   }

//   static async createLogin(req, res) {
//     try {
//       const { email, password } = req.body;

//       if (!email || !password) {
//         return res.render('login', { title: 'Login', error: 'Email and password are required.' });
//       }

//       const user = await User.findOne({ email });
//       if (!user) {
//         return res.render('login', { title: 'Login', error: 'Invalid email or password.' });
//       }

//       const isMatch = user.password === password;
//       if (isMatch) {
//         req.session.user = user;
//         res.redirect('/');
//       } else {
//         res.render('login', { title: 'Login', error: 'Invalid email or password.' });
//       }
//     } catch (error) {
//       console.error('Login error:', error);
//       res.status(500).render('login', { title: 'Login', error: 'Server error. Please try again.' });
//     }
//   }

//   // API cho đăng ký (Flutter)
//   static async apiCreateSignup(req, res) {
//     try {
//       const { name, email, password, confirmpasword, age } = req.body;
//       console.log('Received signup data (API):', { name, email, password, confirmpasword, age });

//       if (!name || !email || !password || !confirmpasword) {
//         return res.status(400).json({ message: 'All fields are required.' });
//       }

//       if (password !== confirmpasword) {
//         return res.status(400).json({ message: 'Passwords do not match.' });
//       }

//       const existingUser = await User.findOne({ email });
//       if (existingUser) {
//         return res.status(400).json({ message: 'Email already in use.' });
//       }

//       const newUser = new User({
//         name,
//         email,
//         password,
//         age: age || undefined,
//       });

//       await newUser.save();
//       res.status(201).json({ message: 'User registered successfully.', user: { name, email } });
//     } catch (error) {
//       console.error('Signup error (API):', error);
//       res.status(500).json({ message: 'Server error. Please try again.' });
//     }
//   }

//   // API cho đăng nhập (Flutter)
//   static async apiCreateLogin(req, res) {
//     try {
//       const { email, password } = req.body;

//       if (!email || !password) {
//         return res.status(400).json({ message: 'Email and password are required.' });
//       }

//       const user = await User.findOne({ email });
//       if (!user) {
//         return res.status(401).json({ message: 'Invalid email or password.' });
//       }

//       const isMatch = user.password === password;
//       if (isMatch) {
//         req.session.user = user;
//         res.status(200).json({ message: 'Login successful.', user: { name: user.name, email: user.email } });
//       } else {
//         res.status(401).json({ message: 'Invalid email or password.' });
//       }
//     } catch (error) {
//       console.error('Login error (API):', error);
//       res.status(500).json({ message: 'Server error. Please try again.' });
//     }
//   }
// }

// export default HomeController;

import User from '../models/user.mjs';

class HomeController {
  static index(req, res) {
    console.log(req.query);
    res.render('index', { title: 'Home Page', user: req.session.user });
  }

  static login(req, res) {
    res.render('login', { title: 'Login', error: null });
  }

  static signup(req, res) {
    res.render('signup', { title: 'Signup', error: null });
  }

  static async createSignup(req, res) {
    try {
      const { name, email, password, confirmpasword, age } = req.body;
      console.log('Received signup data (web):', { name, email, password, confirmpasword, age });

      if (!name || !email || !password || !confirmpasword) {
        return res.render('signup', { title: 'Signup', error: 'All fields are required.' });
      }

      if (password !== confirmpasword) {
        return res.render('signup', { title: 'Signup', error: 'Passwords do not match.' });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.render('signup', { title: 'Signup', error: 'Email already in use.' });
      }

      const newUser = new User({
        name,
        email,
        password,
        age: age || undefined,
      });

      await newUser.save();
      res.redirect('/login');
    } catch (error) {
      console.error('Signup error (web):', error);
      res.status(500).render('signup', { title: 'Signup', error: 'Server error. Please try again.' });
    }
  }

  static async createLogin(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.render('login', { title: 'Login', error: 'Email and password are required.' });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.render('login', { title: 'Login', error: 'Invalid email or password.' });
      }

      const isMatch = user.password === password;
      if (isMatch) {
        req.session.user = user;
        res.redirect('/');
      } else {
        res.render('login', { title: 'Login', error: 'Invalid email or password.' });
      }
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).render('login', { title: 'Login', error: 'Server error. Please try again.' });
    }
  }

  // API cho đăng ký (Flutter)
  static async apiCreateSignup(req, res) {
    try {
      const { name, email, password, confirmpasword, age } = req.body;
      console.log('Received signup data (API):', { name, email, password, confirmpasword, age });

      if (!name || !email || !password || !confirmpasword) {
        return res.status(400).json({ message: 'All fields are required.' });
      }

      if (password !== confirmpasword) {
        return res.status(400).json({ message: 'Passwords do not match.' });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use.' });
      }

      const newUser = new User({
        name,
        email,
        password,
        age: age || undefined,
      });

      await newUser.save();
      res.status(201).json({ message: 'User registered successfully.', user: { name, email } });
    } catch (error) {
      console.error('Signup error (API):', error);
      res.status(500).json({ message: 'Server error. Please try again.' });
    }
  }

  // API cho đăng nhập (Flutter)
  static async apiCreateLogin(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }

      const isMatch = user.password === password;
      if (isMatch) {
        req.session.user = user;
        res.status(200).json({ message: 'Login successful.', user: { name: user.name, email: user.email } });
      } else {
        res.status(401).json({ message: 'Invalid email or password.' });
      }
    } catch (error) {
      console.error('Login error (API):', error);
      res.status(500).json({ message: 'Server error. Please try again.' });
    }
  }

  // API để lấy giỏ hàng
  static async getCart(req, res) {
    try {
      // Giả định giỏ hàng từ session (thay bằng database trong thực tế)
      const cart = req.session.cart || { items: [], subtotal: 0.0 };
      console.log('Returning cart:', cart);
      res.status(200).json(cart);
    } catch (error) {
      console.error('Get Cart error:', error);
      res.status(500).json({ message: 'Server error. Please try again.' });
    }
  }

  // API để thêm sản phẩm vào giỏ hàng
  static async addToCart(req, res) {
    try {
      const { productId, quantity } = req.body;
      console.log('Add to Cart:', { productId, quantity });

      if (!productId || !quantity || quantity <= 0) {
        return res.status(400).json({ message: 'Product ID and valid quantity are required.' });
      }

      req.session.cart = req.session.cart || { items: [], subtotal: 0.0 };
      const existingItem = req.session.cart.items.find(item => item.productId === productId);

      if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.total = existingItem.price * existingItem.quantity;
      } else {
        // Giả định dữ liệu sản phẩm (thay bằng database query trong thực tế)
        const product = {
          productId,
          name: `Product ${productId}`,
          price: 10.0,
          image: 'https://example.com/image.jpg',
          quantity,
          total: 10.0 * quantity,
        };
        req.session.cart.items.push(product);
      }

      req.session.cart.subtotal = req.session.cart.items.reduce((sum, item) => sum + item.total, 0);
      console.log('Updated cart after add:', req.session.cart);

      res.status(200).json({ message: 'Added to cart successfully.', cart: req.session.cart });
    } catch (error) {
      console.error('Add to Cart error:', error);
      res.status(500).json({ message: 'Server error. Please try again.' });
    }
  }

  // API để cập nhật số lượng sản phẩm trong giỏ hàng
  static async updateQuantity(req, res) {
    try {
      const { productId, quantity } = req.body;
      console.log('Update Quantity:', { productId, quantity });

      if (!productId || !quantity) {
        return res.status(400).json({ message: 'Product ID and quantity are required.' });
      }

      req.session.cart = req.session.cart || { items: [], subtotal: 0.0 };
      const itemIndex = req.session.cart.items.findIndex(item => item.productId === productId);

      if (itemIndex !== -1) {
        if (quantity <= 0) {
          req.session.cart.items.splice(itemIndex, 1);
        } else {
          req.session.cart.items[itemIndex].quantity = quantity;
          req.session.cart.items[itemIndex].total = req.session.cart.items[itemIndex].price * quantity;
        }
        req.session.cart.subtotal = req.session.cart.items.reduce((sum, item) => sum + item.total, 0);
        console.log('Updated cart after update:', req.session.cart);
      }

      res.status(200).json({ message: 'Quantity updated successfully.', cart: req.session.cart });
    } catch (error) {
      console.error('Update Quantity error:', error);
      res.status(500).json({ message: 'Server error. Please try again.' });
    }
  }

  // API để xóa sản phẩm khỏi giỏ hàng
  static async removeFromCart(req, res) {
    try {
      const { productId } = req.body;
      console.log('Remove from Cart:', { productId });

      if (!productId) {
        return res.status(400).json({ message: 'Product ID is required.' });
      }

      req.session.cart = req.session.cart || { items: [], subtotal: 0.0 };
      const itemIndex = req.session.cart.items.findIndex(item => item.productId === productId);

      if (itemIndex !== -1) {
        req.session.cart.items.splice(itemIndex, 1);
        req.session.cart.subtotal = req.session.cart.items.reduce((sum, item) => sum + item.total, 0);
        console.log('Updated cart after remove:', req.session.cart);
      }

      res.status(200).json({ message: 'Removed from cart successfully.', cart: req.session.cart });
    } catch (error) {
      console.error('Remove from Cart error:', error);
      res.status(500).json({ message: 'Server error. Please try again.' });
    }
  }
}

export default HomeController;
