import express from "express";
import AdminController from "../controllers/adminController.mjs";
import { isAuthenticated } from '../middlewares/authJwt.mjs';
import { isAdmin } from '../middlewares/isAdmin.mjs';

const router = express.Router();

// Routes quản lý users
router.get("/users", isAuthenticated, isAdmin, AdminController.manageUsers);
router.get("/users/new", isAuthenticated, isAdmin, AdminController.newUser);
router.post("/users/create", isAuthenticated, isAdmin, AdminController.createUser);
router.get("/users/edit/:id", isAuthenticated, isAdmin, AdminController.editUser);
router.post("/users/update/:id", isAuthenticated, isAdmin, AdminController.updateUser);
router.post("/users/delete/:id", isAuthenticated, isAdmin, AdminController.deleteUser);

// Routes quản lý products
router.get("/products", isAuthenticated, isAdmin, AdminController.manageProducts);
router.get("/products/new", isAuthenticated, isAdmin, AdminController.newProduct);
router.post("/products/create", isAuthenticated, isAdmin, AdminController.createProduct);
router.get("/products/edit/:id", isAuthenticated, isAdmin, AdminController.editProduct);
router.post("/products/update/:id", isAuthenticated, isAdmin, AdminController.updateProduct);
router.post("/products/delete/:id", isAuthenticated, isAdmin, AdminController.deleteProduct);

export default router;