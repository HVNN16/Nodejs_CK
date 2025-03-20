import User from "../models/user.mjs";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

class ApiUserController {
  static async register(req, res) {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ message: "Tất cả các trường (name, email, password) đều bắt buộc." });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email đã được sử dụng." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ name, email, password: hashedPassword });
      await user.save();

      res.status(200).json({ message: "Đăng ký thành công!" });
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi đăng ký", error: error.message });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Email và mật khẩu là bắt buộc." });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Email không tồn tại." });
      }

      const checkPass = await bcrypt.compare(password, user.password);
      if (!checkPass) {
        return res.status(401).json({ message: "Mật khẩu không đúng." });
      }

      const payload = { name: user.name, email: user.email };
      const token = jwt.sign(payload, "demoDA", { expiresIn: "1h" });

      res.status(200).json({
        message: "Đăng nhập thành công!",
        accessToken: token,
        user: { name: user.name, email: user.email },
      });
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi đăng nhập", error: error.message });
    }
  }

  static async index(req, res) {
    try {
      const users = await User.find({});
      res.status(200).json({ message: "Lấy danh sách người dùng thành công!", data: users });
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi lấy danh sách người dùng", error: error.message });
    }
  }

  static async show(req, res) {
    try {
      const id = req.params.id;
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "Không tìm thấy người dùng." });
      }
      res.status(200).json({ message: "Lấy dữ liệu người dùng thành công!", data: user });
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi lấy dữ liệu người dùng", error: error.message });
    }
  }

  static async destroy(req, res) {
    try {
      const id = req.params.id;
      const result = await User.deleteOne({ _id: id });
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Không tìm thấy người dùng để xóa." });
      }
      res.status(200).json({ message: "Xóa người dùng thành công!", data: result });
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi xóa người dùng", error: error.message });
    }
  }

  static async create(req, res) {
    try {
      const { name, email, workExperience, age } = req.body;
      if (!name || !email) {
        return res.status(400).json({ message: "Tên và email là bắt buộc." });
      }

      const user = await User.create({ name, email, workExperience, age });
      res.status(200).json({ message: "Tạo người dùng thành công!", user });
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi tạo người dùng", error: error.message });
    }
  }
}

export default ApiUserController;