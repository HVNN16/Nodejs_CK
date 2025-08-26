// router.mjs
import express from 'express';
import { isAuthenticated, isAdmin } from '../../middleware/authMiddleware.mjs';
import { adminController, upload } from '../../controllers/adminController.mjs';
import CheckoutService from '../../services/CheckoutService.mjs';

const router = express.Router();

// User Routes
router.get('/users', isAuthenticated, isAdmin, adminController.manageUsers);
router.post('/users/create', isAuthenticated, isAdmin, adminController.createUser);
router.get('/users/edit/:id', isAuthenticated, isAdmin, adminController.editUser);
router.post('/users/update/:id', isAuthenticated, isAdmin, adminController.updateUser);
router.post('/users/delete/:id', isAuthenticated, isAdmin, adminController.deleteUser);

// Product Routes
router.get('/products', isAuthenticated, isAdmin, adminController.manageProducts);
router.post('/products/create', isAuthenticated, isAdmin, upload.single('image'), adminController.createProduct);
router.get('/products/edit/:id', isAuthenticated, isAdmin, adminController.editProduct);
router.post('/products/update/:id', isAuthenticated, isAdmin, upload.single('image'), adminController.updateProduct);
router.post('/products/delete/:id', isAuthenticated, isAdmin, adminController.deleteProduct);

// Blog Routes
router.get('/blogs', isAuthenticated, isAdmin, adminController.manageBlogs);
router.post('/blogs/create', isAuthenticated, isAdmin, upload.single('image'), adminController.createBlog);
router.get('/blogs/edit/:id', isAuthenticated, isAdmin, adminController.editBlog);
router.post('/blogs/update/:id', isAuthenticated, isAdmin, upload.single('image'), adminController.updateBlog);
router.post('/blogs/delete/:id', isAuthenticated, isAdmin, adminController.deleteBlog);

// Danh sách tất cả đơn hàng (Admin)
// Danh sách tất cả đơn hàng (Admin)
router.get('/orders', isAuthenticated, isAdmin, async (req, res, next) => {
  try {
    const search = req.query.search || '';
    const status = req.query.status || '';
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const { orders, totalPages } = await CheckoutService.getOrdersPaginated(search, status, skip, limit);

    res.render('admin', {
      title: 'Order Management',
      orders,
      q: search,
      status,
      user: req.user,
      action: 'orders', // danh sách
      page,
      totalPages,
      error: null
    });
  } catch (err) {
    next(err);
  }
});

// Chi tiết đơn hàng (Admin)
router.get('/orders/:id', isAuthenticated, isAdmin, async (req, res, next) => {
  try {
    const order = await CheckoutService.getOrderDetailAdmin(req.params.id);
    if (!order) return res.status(404).send('Order not found');

    res.render('admin', { 
      title: 'Order Management',   // giữ title để sidebar active
      action: 'viewOrder',         // EJS hiển thị chi tiết
      order, 
      user: req.user, 
      error: null 
    });
  } catch (err) {
    next(err);
  }
});



// POST: cập nhật trạng thái đơn hàng (AJAX)
router.post('/orders/update-status/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedOrder = await CheckoutService.updateOrderStatus(id, status);

    res.json({ message: 'Cập nhật trạng thái đơn hàng thành công!', order: updatedOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Có lỗi xảy ra khi cập nhật trạng thái.' });
  }
});

export default router;
