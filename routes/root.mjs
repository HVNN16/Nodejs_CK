import express from 'express';
import HomeController from '../controllers/home_controller.mjs';
import { isAuthenticated } from '../middlewares/authJwt.mjs';
import jwt from 'jsonwebtoken';

const rootRouter = express.Router();

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

// Routes cho web
rootRouter.get('/', getUserFromToken, HomeController.index);
rootRouter.get('/login', getUserFromToken, HomeController.login);
rootRouter.post('/login', HomeController.createLogin);
rootRouter.get('/signup', getUserFromToken, HomeController.signup);
rootRouter.post('/signup', HomeController.createSignup);
rootRouter.get('/logout', (req, res) => {
  res.clearCookie('token'); // Xóa token trong cookie (cho web)
  res.redirect('/login');
});


export default rootRouter;