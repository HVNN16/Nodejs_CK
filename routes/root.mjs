// import express from "express";
// import HomeController from "../controllers/home_controller.mjs";
// import { isAuthenticated } from "../middlewares/auth.mjs";

// const rootRouter = express.Router();

// rootRouter.get("/", (req, res) => {
//   res.render("index", { user: req.session.user });
// });
// rootRouter.get("/login", (req, res) => {
//   res.render("login", { title: "Login", user: req.session.user });
// });
// rootRouter.post("/login", HomeController.createLogin);
// rootRouter.get("/signup", (req, res) => {
//   res.render("signup", { title: "Signup", user: req.session.user });
// });
// rootRouter.post("/signup", HomeController.createSignup);
// rootRouter.get("/logout", (req, res) => {
//   req.session.destroy((err) => {
//     if (err) {
//       return res.redirect('/');
//     }
//     res.clearCookie('connect.sid');
//     res.redirect('/login');
//   });
// });

// export default rootRouter;

import express from 'express';
import HomeController from '../controllers/home_controller.mjs';
import { isAuthenticated } from '../middlewares/auth.mjs';

const rootRouter = express.Router();

// Routes cho web
rootRouter.get('/', (req, res) => {
  res.render('index', { user: req.session.user });
});
rootRouter.get('/login', (req, res) => {
  res.render('login', { title: 'Login', user: req.session.user, error: null });
});
rootRouter.post('/login', HomeController.createLogin);
rootRouter.get('/signup', (req, res) => {
  res.render('signup', { title: 'Signup', user: req.session.user, error: null });
});
rootRouter.post('/signup', HomeController.createSignup);
rootRouter.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect('/');
    }
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
});

// Thêm API endpoints cho Flutter
rootRouter.post('/api/register', HomeController.apiCreateSignup);
rootRouter.post('/api/login', HomeController.apiCreateLogin);

export default rootRouter;
