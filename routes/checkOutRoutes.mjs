import express from 'express';
import { checkOutPage, createCheckout, getOrderHistory, getOrderDetail, cancelOrder } from '../controllers/checkOutController.mjs';
import { isAuthenticated } from '../middlewares/auth.mjs';

const router = express.Router();

// Route for checkout page
router.get('/checkout', isAuthenticated, checkOutPage);

// Route to create a new checkout order
router.post('/place-order', isAuthenticated, createCheckout);

// Route to view order history
router.get('/history', isAuthenticated, getOrderHistory);

// Route to view order detail
router.get('/history/:id', isAuthenticated, getOrderDetail);

// Route to cancel an order
router.post('/history/:id/cancel', isAuthenticated, cancelOrder);

export default router;