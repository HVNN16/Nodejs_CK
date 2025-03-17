import express from 'express';
import { getProductDetail, getProductPage } from '../controllers/productController.mjs';
import Product from '../models/product.mjs';

const router = express.Router();

router.get('/product', getProductPage);

router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.render('index', { products });
  } catch (error) {
    res.status(500).send('Error fetching products');
  }
});

router.get('/admin/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi lấy danh sách sản phẩm.' });
  }
});

router.get('/single_product/:id', getProductDetail);

router.get('/product/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send('Product not found');
    }
    res.render('single_product', { product });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).send('Server error');
  }
});

router.post('/add', async (req, res) => {
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

export default router;