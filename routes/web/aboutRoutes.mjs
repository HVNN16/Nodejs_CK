import express from 'express';
import { getUserFromToken } from '../../middleware/authMiddleware.mjs';
import { aboutPage } from '../../controllers/AboutController.mjs';

const router = express.Router();

router.get('/about',getUserFromToken, aboutPage);

export default router;