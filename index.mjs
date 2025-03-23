import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/connectDB.mjs';
import { getUserFromToken } from './middleware/authMiddleware.mjs';
import addBaseUrl from './middleware/responseMiddleware.mjs';
import apiRoutes from './routes/api/apiRoutes.mjs';
import rootRoutes from './routes/web/rootRoutes.mjs';
import aboutRoutes from './routes/web/aboutRoutes.mjs';
import blogRoutes from './routes/web/blogRoutes.mjs';
import cartRoutes from './routes/web/cartRoutes.mjs';
import checkoutRoutes from './routes/web/checkoutRoutes.mjs';
import contactRoutes from './routes/web/contactRoutes.mjs';
import productRoutes from './routes/web/productRoutes.mjs';
import adminRoutes from './routes/web/adminRoutes.mjs';
import userRoutes from './routes/web/userRoutes.mjs';

const app = express();
const port = process.env.PORT || 3000;

dotenv.config();

// Gọi connectDB trước khi sử dụng các route hoặc model
connectDB().then(() => {
  // Sửa CORS để cho phép Flutter truy cập
  app.use(cors({
    origin: (origin, callback) => {
      // Trong production, cho phép Flutter (origin null hoặc localhost) và web
      if (process.env.NODE_ENV === 'production') {
        const allowedOrigins = [
          'https://nodejs-ck-x8q8.onrender.com', // Web
          'http://localhost:8080', // Flutter debug
          undefined // Cho phép yêu cầu không có origin (như từ Flutter)
        ];
        if (allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      } else {
        callback(null, true); // Trong dev, cho phép tất cả (*)
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Đảm bảo hỗ trợ các phương thức cần thiết
    allowedHeaders: ['Content-Type', 'Authorization'] // Đảm bảo header từ Flutter được chấp nhận
  }));

  app.use(cookieParser());
  app.use(express.static('public'));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.set('view engine', 'ejs');
  app.set('views', './views');

  app.use(getUserFromToken);
  app.use(addBaseUrl);

  // Thêm log để debug yêu cầu
  app.use((req, res, next) => {
    console.log(`Received ${req.method} request to ${req.url}`);
    next();
  });

  app.use('/api', apiRoutes);
  app.use('/', rootRoutes);
  app.use('/', aboutRoutes);
  app.use('/', blogRoutes);
  app.use('/', cartRoutes);
  app.use('/', checkoutRoutes);
  app.use('/', contactRoutes);
  app.use('/', productRoutes);
  app.use('/admin', adminRoutes);
  app.use('/users', userRoutes);

  app.use((req, res) => {
    console.log(`404 for ${req.method} ${req.url}`); // Debug 404
    res.status(404).render('404', { title: 'Page Not Found', user: req.user });
  });

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server started on port ${port}`);
  });
}).catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
