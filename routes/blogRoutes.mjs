//routes/blogRoutes.mjs
import express from 'express';
import { getBlogPage, getBlogDetail  } from '../controllers/blogController.mjs';
import Blog from '../models/blog.mjs';

const router = express.Router();

// Route cho trang About
router.get('/blog', getBlogPage);

// Route cho chi tiết blog
router.get('/blog/:id', getBlogDetail);

// Route: Lấy danh blog
router.get('/', async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.render('index', { blogs });
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


// Route: Thêm sản phẩm mới (chỉ để thử nghiệm)
router.post('/add', async (req, res) => {
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
