import express from 'express';
import CartController from '../controllers/cartController.mjs';
import { isAuthenticated } from '../middlewares/auth.mjs';

const router = express.Router();

// Lấy giỏ hàng (giao diện HTML)
router.get('/cart', isAuthenticated, CartController.viewCart);

// Lấy giỏ hàng (JSON API)
router.get('/api/cart', isAuthenticated, CartController.viewCart);

// Thêm vào giỏ hàng
router.post('/add-to-cart', isAuthenticated, CartController.addToCart);

// Cập nhật số lượng
router.post('/update-quantity', isAuthenticated, CartController.updateQuantity);

// Xóa khỏi giỏ hàng
router.post('/remove-from-cart', isAuthenticated, CartController.removeFromCart);

export default router;
