// import express from 'express';
// import { getProductDetail, getProductPage } from '../controllers/productController.mjs';
// import Product from '../models/product.mjs';

// const router = express.Router();

// router.get('/product', getProductPage);

// router.get('/', async (req, res) => {
//   try {
//     const products = await Product.find();
//     res.render('index', { products });
//   } catch (error) {
//     res.status(500).send('Error fetching products');
//   }
// });
// router.get('/admin/api/products', async (req, res) => {
//   try {
//     const products = await Product.find();
//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ error: 'Lỗi khi lấy danh sách sản phẩm.' });
//   }
// });

// router.get('/single_product/:id', getProductDetail);


// router.post('/add', async (req, res) => {
//   try {
//     const { name, price, description, image } = req.body;
//     const product = new Product({ name, price, description, image });
//     await product.save();
//     res.redirect('/');
//   } catch (error) {
//     res.status(500).send('Error adding product');
//   }
// });

// export default router;

import express from 'express';
import { getProductDetail, getProductPage } from '../controllers/productController.mjs';
import Product from '../models/product.mjs';

const router = express.Router();

// Route để render trang danh sách sản phẩm (dành cho web)
router.get('/product', getProductPage);

// Route để render trang chính (dành cho web)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.render('index', { products });
  } catch (error) {
    res.status(500).send('Error fetching products');
  }
});

// Route API để lấy danh sách sản phẩm dưới dạng JSON (dành cho Flutter)
router.get('/admin/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi lấy danh sách sản phẩm.' });
  }
});

// Route API để lấy chi tiết sản phẩm theo ID dưới dạng JSON (dành cho Flutter)
router.get('/admin/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product); // Trả về JSON
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: 'Lỗi khi lấy chi tiết sản phẩm.' });
  }
});

// Route để render trang chi tiết sản phẩm (dành cho web)
router.get('/single_product/:id', getProductDetail);

// Route để thêm sản phẩm mới (dành cho web)
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

export default router;
