import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import dbConnection from './config/connectDB.mjs';
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

// Sử dụng biến môi trường PORT từ Render, mặc định là 3000 nếu không có
const port = process.env.PORT || 3000;

dotenv.config();

// Cấu hình CORS linh hoạt hơn
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? 'https://nodejs-ck-x8q8.onrender.com' // Chỉ cho phép origin này trong production
    : '*', // Cho phép tất cả trong development
  credentials: true
}));

app.use(cookieParser());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', './views');

dbConnection.on('connected', () => console.log('Connected to MongoDB database'));

app.use(getUserFromToken);
app.use(addBaseUrl);

// Định tuyến
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

// Xử lý lỗi 404
app.use((req, res) => {
  res.status(404).render('404', { title: 'Page Not Found', user: req.user });
});

// Lắng nghe trên 0.0.0.0 để nhận lưu lượng từ bên ngoài
app.listen(port, '0.0.0.0', () => {
  console.log(`Server started on port ${port}`);
});
