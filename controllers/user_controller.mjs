import User from '../models/user.mjs';

class UserController {
  static async index(req, res, data) {
    try {
      const users = await User.find();
      res.render('user_index', { users, user: data.user }); // Truyền biến user
    } catch (error) {
      res.status(500).send('Error fetching users');
    }
  }

  static async new(req, res, data) {
    res.render('user_new', { user: data.user }); // Truyền biến user
  }

  static async create(req, res, data) {
    try {
      const { email, name, age, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({ email, name, age, password: hashedPassword });
      res.redirect('/api/v1');
    } catch (error) {
      res.render('user_new', { error, user: data.user }); // Truyền biến user
    }
  }

  static async delete(req, res, data) {
    try {
      await User.deleteOne({ _id: req.params.id });
      res.redirect('/api/v1');
    } catch (error) {
      res.status(500).send('Error deleting user');
    }
  }
}

export default UserController;