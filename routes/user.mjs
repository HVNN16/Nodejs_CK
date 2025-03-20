import express from "express";
import UserController from "../controllers/user_controller.mjs";
import { isAuthenticated } from "../middlewares/authJwt.mjs";

const userRouter = express.Router();

userRouter.get("/", isAuthenticated, (req, res) => {
  UserController.index(req, res, { user: req.user }); // Sử dụng req.user thay vì req.session.user
});
userRouter.get("/new", isAuthenticated, (req, res) => {
  UserController.new(req, res, { user: req.user });
});
userRouter.post("/create", isAuthenticated, (req, res) => {
  UserController.create(req, res, { user: req.user });
});
userRouter.delete("/delete/:id", isAuthenticated, (req, res) => {
  UserController.delete(req, res, { user: req.user });
});

export default userRouter;