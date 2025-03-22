import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from 'cookie-parser';
import { productDBConnection, userDBConnection } from "./config/connectDB.mjs";
import AdminController from "./controllers/adminController.mjs";
import { isAdmin } from "./middlewares/isAdmin.mjs";
import { getUserFromToken, isAuthenticated } from "./middlewares/authJwt.mjs";
import rootRouter from "./routes/root.mjs";
import apiuserRouter from "./routes/api.mjs";
import aboutRouter from "./routes/aboutRoutes.mjs";
import blogRouter from "./routes/blogRoutes.mjs";
import cartRouter from "./routes/cartRoutes.mjs";
import checkOutRouter from "./routes/checkOutRoutes.mjs";
import contactRouter from "./routes/contactRoutes.mjs";
import productRouter from "./routes/productRoutes.mjs";
import singleProductRouter from "./routes/singleProductRoutes.mjs";
import dotenv from 'dotenv';
import addBaseUrl from "./middlewares/addBaseUrl.js";

// Khởi tạo ứng dụng Express
const app = express();
const port = 3000;

// Cấu hình CORS để cho phép Flutter gọi API
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

// Cấu hình middleware
app.use(cookieParser());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
dotenv.config();
// Cấu hình view engine
app.set("view engine", "ejs");
app.set("views", "./views");

// Kết nối cơ sở dữ liệu
userDBConnection.on("connected", () => {
  console.log("Successfully connected to users database.");
});

productDBConnection.on("connected", () => {
  console.log("Successfully connected to productDB.");
});

// Middleware để lấy user từ token (nếu có, không bắt buộc)

// Áp dụng middleware cho tất cả các route
//app.use(getUserFromToken);
app.use(addBaseUrl);
// Định nghĩa các route
app.use("/", rootRouter);
app.use("/api/v1", apiuserRouter);
app.use("/", aboutRouter);
app.use("/", productRouter);
app.use("/", singleProductRouter);
app.use("/", cartRouter);
app.use("/", checkOutRouter);
app.use("/", blogRouter);
app.use("/", contactRouter);

// Routes cho admin (quản lý users và products)
app.get("/admin/users", isAuthenticated, isAdmin, AdminController.manageUsers);
app.get("/admin/users/new", isAuthenticated, isAdmin, AdminController.newUser);
app.post("/admin/users/create", isAuthenticated, isAdmin, AdminController.createUser);
app.get("/admin/users/edit/:id", isAuthenticated, isAdmin, AdminController.editUser);
app.post("/admin/users/update/:id", isAuthenticated, isAdmin, AdminController.updateUser);
app.post("/admin/users/delete/:id", isAuthenticated, isAdmin, AdminController.deleteUser);

app.get("/admin/products", isAuthenticated, isAdmin, AdminController.manageProducts);
app.get("/admin/products/new", isAuthenticated, isAdmin, AdminController.newProduct);
app.post("/admin/products/create", isAuthenticated, isAdmin, AdminController.createProduct);
app.get("/admin/products/edit/:id", isAuthenticated, isAdmin, AdminController.editProduct);
app.post("/admin/products/update/:id", isAuthenticated, isAdmin, AdminController.updateProduct);
app.post("/admin/products/delete/:id", isAuthenticated, isAdmin, AdminController.deleteProduct);

// Route xử lý đặt hàng (place-order)
app.post('/place-order', isAuthenticated, async (req, res) => {
  const { firstname, lastname, phone, email } = req.body;

  if (!firstname || !lastname || !phone || !email) {
    return res.status(400).json({ message: 'Tất cả các trường đều bắt buộc. Vui lòng điền đầy đủ thông tin.' });
  }

  console.log(`Đơn hàng được đặt bởi ${firstname} ${lastname}. Liên hệ: ${phone}, ${email}.`);
  res.status(200).json({ message: 'Đơn hàng đã được đặt thành công!' });
});

// Route xử lý lỗi 404
app.use((req, res) => {
  // res.status(404).render('404', { title: 'Page Not Found', user: req.user });
  res.status(404).json({ message: 'Route not found' });
});

// Khởi động server
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});