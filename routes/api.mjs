import express from 'express';
import ApiUserController from '../controllers/api_user_controller.mjs';
import HomeController from '../controllers/home_controller.mjs';
import { isAuthenticated } from '../middlewares/authJwt.mjs';
import Product from '../models/product.mjs';
import rootRouter from './root.mjs';
import { getOrderDetailApi, getOrderHistoryApi } from '../controllers/checkOutController.mjs';

const router = express.Router();

// API đăng ký
router.post('/register', ApiUserController.register);

// API đăng nhập
router.post('/login', ApiUserController.login);

// API lấy danh sách người dùng
router.get('/users', ApiUserController.index);

// API lấy thông tin một người dùng
router.get('/users/:id', ApiUserController.show);

// API xóa người dùng
router.delete('/users/:id', ApiUserController.destroy);

// API tạo người dùng
router.post('/users', ApiUserController.create);

// API endpoint để lấy danh sách sản phẩm (cho Flutter)
router.get('/admin/api/products', async (req, res) => {
    try {
      const products = await Product.find();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: 'Lỗi khi lấy danh sách sản phẩm.' });
    }
  });
  
  
  // API để lấy chi tiết sản phẩm (cho Flutter)
  router.get('/api/product/:id', async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.status(200).json(product);
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
// API endpoints cho Flutter
rootRouter.post('/api/register', HomeController.apiCreateSignup);
rootRouter.post('/api/login', HomeController.apiCreateLogin);

// API endpoints cho giỏ hàng

rootRouter.get('/api/cart', isAuthenticated, HomeController.getCart);
rootRouter.post('/api/cart/add', isAuthenticated, HomeController.addToCart);
rootRouter.put('/api/cart/update', isAuthenticated, HomeController.updateQuantity);
rootRouter.delete('/api/cart/remove', isAuthenticated, HomeController.removeFromCart);

// Route mới trong checkOutRoutes.mjs
router.get('/api/history', isAuthenticated, getOrderHistoryApi);
router.get('/api/history/:id', isAuthenticated, getOrderDetailApi);
export default router;