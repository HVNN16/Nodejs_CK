import express from 'express';
import { getBlogPage, getBlogDetail } from '../../controllers/blogController.mjs';
import { getUserFromToken } from '../../middleware/authMiddleware.mjs';

const router = express.Router();

router.get('/blog', getUserFromToken, getBlogPage);
router.get('/blog/:id', getUserFromToken, getBlogDetail);

export default router;
