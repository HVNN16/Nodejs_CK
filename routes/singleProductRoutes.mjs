import express from 'express';
import {getSingleProductPage} from '../controllers/singleProductController.mjs';

const router = express.Router();

// Route cho trang Single Product
router.get('/single_product', getSingleProductPage);

export default router;
