import UserService from '../services/UserService.mjs';
import ProductService from '../services/ProductService.mjs';
import bcrypt from 'bcrypt';

class AdminController {
  static async manageUsers(req, res) {
    const q = req.query.q;
    const users = await UserService.searchUsers(q);
    res.render('admin_users', { title: 'User Management', users, q, user: req.user });
  }

  static async newUser(req, res) {
    res.render('formnew_user', { title: 'Add New User', user: req.user });
  }

  static async createUser(req, res) {
    try {
      const { email, name, age, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      await UserService.createUser({ email, name, age, password: hashedPassword });
      res.redirect('/admin/users');
    } catch (error) {
      res.render('formnew_user', { title: 'Add New User', error, user: req.user });
    }
  }

  static async editUser(req, res) {
    const editUser = await UserService.getUserById(req.params.id);
    if (editUser) {
      res.render('formedit_user', { title: 'Edit User', editUser, user: req.user });
    } else {
      res.redirect('/admin/users');
    }
  }

  static async updateUser(req, res) {
    try {
      const { email, name, age, password } = req.body;
      const updateData = { email, name, age };
      if (password && password.trim() !== '') {
        updateData.password = await bcrypt.hash(password, 10);
      }
      await UserService.updateUser(req.params.id, updateData);
      res.redirect('/admin/users');
    } catch (error) {
      const editUser = await UserService.getUserById(req.params.id);
      res.render('formedit_user', { title: 'Edit User', editUser, error, user: req.user });
    }
  }

  static async deleteUser(req, res) {
    await UserService.deleteUser(req.params.id);
    res.redirect('/admin/users');
  }

  static async manageProducts(req, res) {
    const q = req.query.q;
    const products = await ProductService.searchProducts(q);
    res.render('admin_products', { title: 'Product Management', products, q, user: req.user });
  }

  static async newProduct(req, res) {
    res.render('formnew_product', { title: 'Add New Product', user: req.user });
  }

  static async createProduct(req, res) {
    try {
      const { name, category, price, originalPrice, image, sale, newArrival, bestSeller } = req.body;
      const productData = {
        name, category, price, originalPrice, image,
        sale: sale === 'on', newArrival: newArrival === 'on', bestSeller: bestSeller === 'on'
      };
      await ProductService.createProduct(productData);
      res.redirect('/admin/products');
    } catch (error) {
      res.render('formnew_product', { title: 'Add New Product', error, user: req.user });
    }
  }

  static async editProduct(req, res) {
    const product = await ProductService.getProductById(req.params.id);
    if (product) {
      res.render('formedit_product', { title: 'Edit Product', product, user: req.user });
    } else {
      res.redirect('/admin/products');
    }
  }

  static async updateProduct(req, res) {
    try {
      const { name, category, price, originalPrice, image, sale, newArrival, bestSeller } = req.body;
      const productData = {
        name, category, price, originalPrice, image,
        sale: sale === 'on', newArrival: newArrival === 'on', bestSeller: bestSeller === 'on'
      };
      await ProductService.updateProduct(req.params.id, productData);
      res.redirect('/admin/products');
    } catch (error) {
      const product = await ProductService.getProductById(req.params.id);
      res.render('formedit_product', { title: 'Edit Product', product, error, user: req.user });
    }
  }

  static async deleteProduct(req, res) {
    await ProductService.deleteProduct(req.params.id);
    res.redirect('/admin/products');
  }
  static async createUserApi(req, res) {
    try {
      const { email, name, age, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await UserService.createUser({ email, name, age, password: hashedPassword });
      res.status(201).json({ message: 'Tạo người dùng thành công', user });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default AdminController;