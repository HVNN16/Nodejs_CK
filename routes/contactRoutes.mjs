import express from 'express';
import { contactPage, submitMessage } from '../controllers/contactController.mjs';
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

// Route cho trang Contact
router.get('/contact', getUserFromToken, contactPage);
router.post('/contact/submit', getUserFromToken, submitMessage);

export default router;