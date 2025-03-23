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
const port = 3000;

dotenv.config();
app.use(cors({ origin: 'https://nodejs-ck-x8q8.onrender.com', credentials: true }));
app.use(cookieParser());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', './views');

dbConnection.on('connected', () => console.log('Connected to MongoDB database'));

app.use(getUserFromToken);
app.use(addBaseUrl);

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

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
