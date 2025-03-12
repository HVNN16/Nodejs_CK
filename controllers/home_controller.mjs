import User from '../models/user.mjs';

class HomeController {
  static index(req, res) {
    console.log(req.query);
    res.render('index', { title: 'Home Page', user: req.session.user });
  }

  static login(req, res) {
    res.render('login', { title: 'Login', error: null });
  }

  static signup(req, res) {
    res.render('signup', { title: 'Signup', error: null });
  }

  static async createSignup(req, res) {
    try {
      const { name, email, password, confirmpasword, age } = req.body;

      if (!name || !email || !password || !confirmpasword) {
        return res.render('signup', { title: 'Signup', error: 'All fields are required.' });
      }

      if (password !== confirmpasword) {
        return res.render('signup', { title: 'Signup', error: 'Passwords do not match.' });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.render('signup', { title: 'Signup', error: 'Email already in use.' });
      }

      const newUser = new User({
        name,
        email,
        password,
        age: age || undefined,
      });

      await newUser.save();
      res.redirect('/login');
    } catch (error) {
      console.error(error);
      res.status(500).render('signup', { title: 'Signup', error: 'Server error. Please try again.' });
    }
  }

  static async createLogin(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.render('login', { title: 'Login', error: 'Email and password are required.' });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.render('login', { title: 'Login', error: 'Invalid email or password.' });
      }

      const isMatch = user.password === password;
      if (isMatch) {
        req.session.user = user;
        res.redirect('/');
      } else {
        res.render('login', { title: 'Login', error: 'Invalid email or password.' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).render('login', { title: 'Login', error: 'Server error. Please try again.' });
    }
  }

  // API cho đăng ký (Flutter)
  static async apiCreateSignup(req, res) {
    try {
      const { name, email, password, confirmpasword, age } = req.body;

      if (!name || !email || !password || !confirmpasword) {
        return res.status(400).json({ message: 'All fields are required.' });
      }

      if (password !== confirmpasword) {
        return res.status(400).json({ message: 'Passwords do not match.' });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use.' });
      }

      const newUser = new User({
        name,
        email,
        password,
        age: age || undefined,
      });

      await newUser.save();
      res.status(201).json({ message: 'User registered successfully.', user: { name, email } });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error. Please try again.' });
    }
  }

  // API cho đăng nhập (Flutter)
  static async apiCreateLogin(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }

      const isMatch = user.password === password;
      if (isMatch) {
        req.session.user = user;
        res.status(200).json({ message: 'Login successful.', user: { name: user.name, email: user.email } });
      } else {
        res.status(401).json({ message: 'Invalid email or password.' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error. Please try again.' });
    }
  }
}

export default HomeController;
