import express from 'express';
import ApiUserController from '../controllers/api_user_controller.mjs';

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

export default router;