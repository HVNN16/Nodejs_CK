import express from 'express';
import { getBlogPage, getBlogDetail } from '../controllers/blogController.mjs';
import Blog from '../models/blog.mjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware để lấy user từ token (nếu có, không bắt buộc)
const getUserFromToken = (req, res, next) => {
  const token = req.cookies.token || (req.headers['authorization'] && req.headers['authorization'].split(' ')[1]);

  if (token) {
    try {
      const decoded = jwt.verify(token, 'demoDA');
      req.user = decoded;
    } catch (error) {
      req.user = null;
    }
  } else {
    req.user = null;
  }
  next();
};

// Route cho trang Blog
router.get('/blog', getUserFromToken, getBlogPage);

// Route cho chi tiết blog
router.get('/blog/:id', getUserFromToken, getBlogDetail);

// Route: Lấy danh sách blog (trang chủ)
router.get('/', getUserFromToken, async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.render('index', { blogs, user: req.user }); // Truyền biến user
  } catch (error) {
    res.status(500).send('Error fetching blogs');
  }
});

// Route API: Lấy danh sách blog dưới dạng JSON
router.get('/admin/api/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi lấy danh sách blog.' });
  }
});

// Route: Thêm blog mới (chỉ để thử nghiệm)
router.post('/add', getUserFromToken, async (req, res) => {
  try {
    const { title, description, image, date, content } = req.body;
    const blog = new Blog({ title, description, image, date, content });
    await blog.save();
    res.redirect('/');
  } catch (error) {
    console.error('Error adding blog:', error);
    res.status(500).send('Error adding blog');
  }
});

export default router;