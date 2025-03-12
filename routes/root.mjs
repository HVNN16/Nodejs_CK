// import express from "express";
// import HomeController from "../controllers/home_controller.mjs";


// // ẨN VIỆC PHẢI ĐĂNG NHẬP TRƯỚC KHI TRUY CẬP
// // function checkLogin(req, res, next) {
// //   if (req.session.user) {
// //     next();
// //   } else {
// //     res.redirect("/login");
// //   }
// // }

// const rootRouter = express.Router();
// // rootRouter.get("/", checkLogin, HomeController.index);
// rootRouter.get("/", HomeController.index);

// rootRouter.get("/login", HomeController.login);
// rootRouter.post("/login", HomeController.createLogin);
// rootRouter.get("/signup", HomeController.signup);
// rootRouter.post("/signup", HomeController.createSignup);


// export default rootRouter;

import express from 'express';
import HomeController from '../controllers/home_controller.mjs';

const rootRouter = express.Router();

// Routes cho web
rootRouter.get('/', HomeController.index); // Không cần checkLogin
rootRouter.get('/login', HomeController.login);
rootRouter.post('/login', HomeController.createLogin);
rootRouter.get('/signup', HomeController.signup);
rootRouter.post('/signup', HomeController.createSignup);

// API endpoints cho Flutter
rootRouter.post('/api/register', HomeController.apiCreateSignup);
rootRouter.post('/api/login', HomeController.apiCreateLogin);

export default rootRouter;
