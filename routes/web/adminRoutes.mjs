// router.mjs
import express from 'express';
import { isAuthenticated, isAdmin } from '../../middleware/authMiddleware.mjs';
import { AdminController, upload } from '../../controllers/AdminController.mjs';

const router = express.Router();

// User Routes
router.get('/users', isAuthenticated, isAdmin, AdminController.manageUsers);
router.post('/users/create', isAuthenticated, isAdmin, AdminController.createUser);
router.get('/users/edit/:id', isAuthenticated, isAdmin, AdminController.editUser);
router.post('/users/update/:id', isAuthenticated, isAdmin, AdminController.updateUser);
router.post('/users/delete/:id', isAuthenticated, isAdmin, AdminController.deleteUser);

// Product Routes
router.get('/products', isAuthenticated, isAdmin, AdminController.manageProducts);
router.post('/products/create', isAuthenticated, isAdmin, upload.single('image'), AdminController.createProduct);
router.get('/products/edit/:id', isAuthenticated, isAdmin, AdminController.editProduct);
router.post('/products/update/:id', isAuthenticated, isAdmin, upload.single('image'), AdminController.updateProduct);
router.post('/products/delete/:id', isAuthenticated, isAdmin, AdminController.deleteProduct);

// Blog Routes
router.get('/blogs', isAuthenticated, isAdmin, AdminController.manageBlogs);
router.post('/blogs/create', isAuthenticated, isAdmin, upload.single('image'), AdminController.createBlog);
router.get('/blogs/edit/:id', isAuthenticated, isAdmin, AdminController.editBlog);
router.post('/blogs/update/:id', isAuthenticated, isAdmin, upload.single('image'), AdminController.updateBlog);
router.post('/blogs/delete/:id', isAuthenticated, isAdmin, AdminController.deleteBlog);

export default router;