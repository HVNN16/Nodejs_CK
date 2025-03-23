import express from 'express';
import UserController from '../../controllers/UserController.mjs';
import { isAuthenticated } from '../../middleware/authMiddleware.mjs';

const router = express.Router();

router.get('/', isAuthenticated, UserController.index);
router.get('/new', isAuthenticated, UserController.new);
router.post('/create', isAuthenticated, UserController.create);
router.delete('/delete/:id', isAuthenticated, UserController.delete);

export default router;