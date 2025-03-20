import User from "../models/user.mjs";
import Product from "../models/product.mjs";
import bcrypt from 'bcrypt';

class AdminController {
  // Trang quản lý Users
  static async manageUsers(req, res) {
    let q = req.query.q;
    const re = new RegExp(q);
    let users;
    if (q) {
      users = await User.find({ $or: [{ name: re }, { email: re }] });
    } else {
      users = await User.find({});
    }
    res.render("admin_users", { title: "User Management", users, q, user: req.user }); // Truyền biến user
  }

  // Trang thêm User mới
  static async newUser(req, res) {
    res.render("formnew_user", { title: "Add New User", user: req.user }); // Truyền biến user
  }

  // Tạo User mới
  static async createUser(req, res) {
    let { email, name, age, password } = req.body;
    try {
      // Mã hóa mật khẩu trước khi lưu
      const hashedPassword = await bcrypt.hash(password, 10);
      let user = await User.create({ email, name, age, password: hashedPassword });
      if (user) {
        res.redirect("/admin/users");
      } else {
        res.render("formnew_user", { title: "Add New User", user: req.user }); // Truyền biến user
      }
    } catch (error) {
      console.error(error);
      res.render("formnew_user", { title: "Add New User", error, user: req.user }); // Truyền biến user
    }
  }

  // Trang sửa User
  static async editUser(req, res) {
    let id = req.params.id;
    let user = await User.findById(id);
    if (user) {
      res.render("formedit_user", { title: "Edit User", user: req.user, editUser: user }); // Truyền biến user
    } else {
      res.redirect("/admin/users");
    }
  }

  // Cập nhật User
  static async updateUser(req, res) {
    let id = req.params.id;
    let { email, name, age, password } = req.body;

    try {
      let updateData = { email, name, age };

      // Nếu trường password không rỗng, mã hóa và cập nhật
      if (password && password.trim() !== "") {
        updateData.password = await bcrypt.hash(password, 10);
      }

      await User.updateOne({ _id: id }, updateData);
      res.redirect("/admin/users");
    } catch (error) {
      console.error(error);
      let editUser = await User.findById(id);
      res.render("formedit_user", { title: "Edit User", user: req.user, editUser, error }); // Truyền biến user
    }
  }

  // Xóa User
  static async deleteUser(req, res) {
    let id = req.params.id;
    await User.deleteOne({ _id: id });
    res.redirect("/admin/users");
  }

  // Trang quản lý Products
  static async manageProducts(req, res) {
    let q = req.query.q;
    const re = new RegExp(q);
    let products;
    if (q) {
      products = await Product.find({ name: re });
    } else {
      products = await Product.find({});
    }
    res.render("admin_products", { title: "Product Management", products, q, user: req.user }); // Truyền biến user
  }

  // Trang thêm Product mới
  static async newProduct(req, res) {
    res.render("formnew_product", { title: "Add New Product", user: req.user }); // Truyền biến user
  }

  // Tạo Product mới
  static async createProduct(req, res) {
    let { name, category, price, originalPrice, image, sale, newArrival, bestSeller } = req.body;

    sale = sale === "on";
    newArrival = newArrival === "on";
    bestSeller = bestSeller === "on";

    try {
      let product = await Product.create({
        name,
        category,
        price,
        originalPrice,
        image,
        sale,
        newArrival,
        bestSeller,
      });
      res.redirect("/admin/products");
    } catch (error) {
      console.error(error);
      res.render("formnew_product", { title: "Add New Product", error, user: req.user }); // Truyền biến user
    }
  }

  // Trang sửa Product
  static async editProduct(req, res) {
    let id = req.params.id;
    let product = await Product.findById(id);
    if (product) {
      res.render("formedit_product", { title: "Edit Product", product, user: req.user }); // Truyền biến user
    } else {
      res.redirect("/admin/products");
    }
  }

  // Cập nhật Product
  static async updateProduct(req, res) {
    let id = req.params.id;
    let { name, category, price, originalPrice, image, sale, newArrival, bestSeller } = req.body;

    sale = sale === "on";
    newArrival = newArrival === "on";
    bestSeller = bestSeller === "on";

    try {
      await Product.updateOne(
        { _id: id },
        { name, category, price, originalPrice, image, sale, newArrival, bestSeller }
      );
      res.redirect("/admin/products");
    } catch (error) {
      console.error(error);
      let product = await Product.findById(id);
      res.render("formedit_product", { title: "Edit Product", product, error, user: req.user }); // Truyền biến user
    }
  }

  // Xóa Product
  static async deleteProduct(req, res) {
    let id = req.params.id;
    await Product.deleteOne({ _id: id });
    res.redirect("/admin/products");
  }
}

export default AdminController;