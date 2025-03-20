import express from 'express';
import { getProductDetail, getProductPage } from '../controllers/productController.mjs';
import Product from '../models/product.mjs';
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

// Route cho trang danh sách sản phẩm
router.get('/product', getUserFromToken, getProductPage);

// Route cho trang chủ (index)
router.get('/', getUserFromToken, async (req, res) => {
  try {
    const products = await Product.find();
    res.render('index', { products, user: req.user }); // Truyền biến user
  } catch (error) {
    res.status(500).send('Error fetching products');
  }
});


// Route cho trang chi tiết sản phẩm (single_product)
router.get('/single_product/:id', getUserFromToken, getProductDetail);

// Route cho trang chi tiết sản phẩm (product/:id)
router.get('/product/:id', getUserFromToken, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send('Product not found');
    }
    res.render('single_product', { product, user: req.user }); // Truyền biến user
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).send('Server error');
  }
});

// Route để thêm sản phẩm mới
router.post('/add', getUserFromToken, async (req, res) => {
  try {
    const { name, price, description, image } = req.body;
    const product = new Product({ name, price, description, image });
    await product.save();
    res.redirect('/');
  } catch (error) {
    res.status(500).send('Error adding product');
  }
});

// Endpoint cho autocomplete
router.get('/product/autocomplete', async (req, res) => {
  const term = req.query.term || '';
  try {
    const suggestions = await Product.find({ name: { $regex: term, $options: 'i' } })
      .limit(10)
      .select('name');
    res.json(suggestions.map(product => product.name));
  } catch (error) {
    console.error('Error fetching autocomplete suggestions:', error);
    res.status(500).json([]);
  }
});

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
export default router;